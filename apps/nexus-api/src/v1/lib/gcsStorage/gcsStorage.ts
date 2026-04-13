import { Storage } from "@google-cloud/storage";
import crypto from "node:crypto";

type UploadFileInput = {
  arrayBuffer: ArrayBuffer;
  fileName: string;
  fileType: string;
};

export type UploadFileResult = {
  reference: string;
  previewUrl: string;
  previewUrlType: "signed" | "public";
  signedPreviewUrl?: string;
  previewUrlExpiresAt?: string;
  publicPreviewUrl: string;
  bucketName: string;
  objectPath: string;
};

type DeleteFileResult = {
  reference: string;
  deleted: boolean;
};

type GcsReference = {
  bucketName: string;
  objectPath: string;
};

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const getStorageClient = (): Storage => {
  const projectId = requiredEnv("GCS_PROJECT_ID");
  const credentialsFile = process.env.GCS_CREDENTIALS_FILE;

  if (credentialsFile && credentialsFile.trim().length > 0) {
    return new Storage({
      projectId,
      keyFilename: credentialsFile,
    });
  }

  return new Storage({ projectId });
};

const getUploadPrefix = (): string => {
  const prefix = process.env.GCS_UPLOAD_PREFIX?.trim();
  if (!prefix) {
    return "local-test";
  }
  return prefix.replace(/^\/+|\/+$/g, "");
};

const getPublicBaseUrl = (): string => {
  const baseUrl = process.env.GCS_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    return "https://storage.googleapis.com";
  }
  return baseUrl.replace(/\/+$/g, "");
};

const getPreviewUrlType = (): "signed" | "public" => {
  const value = process.env.GCS_PREVIEW_URL_TYPE?.trim().toLowerCase();
  if (value === "public") {
    return "public";
  }
  return "signed";
};

const getSignedUrlExpiresSeconds = (): number => {
  const value = process.env.GCS_SIGNED_URL_EXPIRES_SECONDS?.trim();
  if (!value) {
    return 900;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      "GCS_SIGNED_URL_EXPIRES_SECONDS must be a positive integer.",
    );
  }

  return parsed;
};

const shouldMakePublic = (): boolean =>
  process.env.GCS_MAKE_PUBLIC_ON_UPLOAD === "true";

const sanitizeFileName = (fileName: string): string => {
  const trimmed = fileName.trim();
  if (!trimmed) {
    return "unnamed-file";
  }

  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const buildObjectPath = (fileName: string): string => {
  const prefix = getUploadPrefix();
  const uniqueId = crypto.randomUUID();
  const safeName = sanitizeFileName(fileName);

  return `${prefix}/${uniqueId}-${safeName}`;
};

const toReference = (bucketName: string, objectPath: string): string =>
  `gcs://${bucketName}/${objectPath}`;

const parseReference = (
  reference: string,
  defaultBucketName: string,
): GcsReference => {
  if (reference.startsWith("gcs://")) {
    const withoutScheme = reference.slice("gcs://".length);
    const [bucketName, ...objectPathParts] = withoutScheme.split("/");
    const objectPath = objectPathParts.join("/");

    if (!bucketName || !objectPath) {
      throw new Error(
        `Invalid reference "${reference}". Expected format: gcs://<bucket>/<objectPath>`,
      );
    }

    return { bucketName, objectPath };
  }

  const objectPath = reference.replace(/^\/+/g, "");
  if (!objectPath) {
    throw new Error("Reference cannot be empty.");
  }

  return { bucketName: defaultBucketName, objectPath };
};

export async function uploadFileToGcs(
  input: UploadFileInput,
): Promise<UploadFileResult> {
  const bucketName = requiredEnv("GCS_BUCKET_NAME");
  const storage = getStorageClient();
  const previewUrlType = getPreviewUrlType();
  const objectPath = buildObjectPath(input.fileName);
  const file = storage.bucket(bucketName).file(objectPath);

  const content = Buffer.from(new Uint8Array(input.arrayBuffer));
  await file.save(content, {
    resumable: false,
    metadata: {
      contentType: input.fileType,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  const encodedPath = objectPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  const publicPreviewUrl = `${getPublicBaseUrl()}/${bucketName}/${encodedPath}`;

  let previewUrl = publicPreviewUrl;
  let signedPreviewUrl: string | undefined;
  let previewUrlExpiresAt: string | undefined;

  if (previewUrlType === "public") {
    if (shouldMakePublic()) {
      await file.makePublic();
    }
  } else {
    const expiresAtMs = Date.now() + getSignedUrlExpiresSeconds() * 1000;
    const signedUrlConfig = {
      version: "v4" as const,
      action: "read" as const,
      expires: expiresAtMs,
    };

    try {
      [signedPreviewUrl] = await file.getSignedUrl(signedUrlConfig);
    } catch {
      throw new Error(
        "Failed to create signed preview URL. Ensure GCS_CREDENTIALS_FILE points to a valid service account JSON key.",
      );
    }

    previewUrl = signedPreviewUrl;
    previewUrlExpiresAt = new Date(expiresAtMs).toISOString();
  }

  return {
    reference: toReference(bucketName, objectPath),
    previewUrl,
    previewUrlType,
    signedPreviewUrl,
    previewUrlExpiresAt,
    publicPreviewUrl,
    bucketName,
    objectPath,
  };
}

export async function deleteFileFromGcs(
  reference: string,
): Promise<DeleteFileResult> {
  const defaultBucketName = requiredEnv("GCS_BUCKET_NAME");
  const storage = getStorageClient();
  const parsed = parseReference(reference, defaultBucketName);
  const file = storage.bucket(parsed.bucketName).file(parsed.objectPath);

  await file.delete({ ignoreNotFound: true });

  return {
    reference: toReference(parsed.bucketName, parsed.objectPath),
    deleted: true,
  };
}
