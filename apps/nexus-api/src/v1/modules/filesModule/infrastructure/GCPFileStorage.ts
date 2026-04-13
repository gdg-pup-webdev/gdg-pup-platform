import { Storage } from "@google-cloud/storage";
import crypto from "node:crypto";
import { configs } from "@/configs/configs";
import { FileBuffer } from "../domain/FileBuffer";
import { IFileStorage } from "../domain/IFileStorage";
import { UploadedFileBuffer } from "../domain/UploadedFileBuffer";

type GcsReference = {
  bucketName: string;
  objectPath: string;
};

export class GCPFileStorage implements IFileStorage {
  private readonly storage: Storage;

  constructor() {
    const storageOptions: ConstructorParameters<typeof Storage>[0] = {};

    if (configs.gcp.projectId) {
      storageOptions.projectId = configs.gcp.projectId;
    }

    if (configs.gcp.credentialsFile) {
      storageOptions.keyFilename = configs.gcp.credentialsFile;
    }

    this.storage = new Storage(storageOptions);
  }

  private getBucketName(): string {
    if (!configs.gcp.bucketName) {
      throw new Error("Missing GCS bucket name. Configure GCS_BUCKET_NAME.");
    }

    return configs.gcp.bucketName;
  }

  private sanitizeFileName(fileName: string): string {
    const trimmed = fileName.trim();
    if (!trimmed) {
      return "unnamed-file";
    }

    return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
  }

  private buildObjectPath(fileName: string): string {
    const uniqueId = crypto.randomUUID();
    const safeName = this.sanitizeFileName(fileName);

    return `${configs.gcp.uploadPrefix}/${uniqueId}-${safeName}`;
  }

  private buildPublicUrl(bucketName: string, objectPath: string): string {
    const encodedPath = objectPath
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");

    return `${configs.gcp.publicBaseUrl}/${bucketName}/${encodedPath}`;
  }

  private toReference(bucketName: string, objectPath: string): string {
    return `gcs://${bucketName}/${objectPath}`;
  }

  private parseReference(
    reference: string,
    defaultBucketName: string,
  ): GcsReference {
    if (reference.startsWith("gcs://")) {
      const withoutScheme = reference.slice("gcs://".length);
      const [bucketName, ...objectPathParts] = withoutScheme.split("/");
      const objectPath = objectPathParts.join("/");

      if (!bucketName || !objectPath) {
        throw new Error(
          `Invalid storage reference \"${reference}\". Expected gcs://<bucket>/<path>.`,
        );
      }

      return { bucketName, objectPath };
    }

    const objectPath = reference.replace(/^\/+/g, "");
    if (!objectPath) {
      throw new Error("Storage reference cannot be empty.");
    }

    return {
      bucketName: defaultBucketName,
      objectPath,
    };
  }

  async uploadFileBuffer(file: FileBuffer): Promise<UploadedFileBuffer> {
    const bucketName = this.getBucketName();
    const objectPath = this.buildObjectPath(file.name);
    const storageFile = this.storage.bucket(bucketName).file(objectPath);

    const fileContent = Buffer.from(new Uint8Array(file.arraybuffer));
    await storageFile.save(fileContent, {
      resumable: false,
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    const publicUrl = this.buildPublicUrl(bucketName, objectPath);
    let previewUrl = publicUrl;

    if (configs.gcp.previewUrlType === "public") {
      if (configs.gcp.makePublicOnUpload) {
        await storageFile.makePublic();
      }
    } else {
      const expiresAtMs = Date.now() + configs.gcp.signedUrlExpiresSeconds * 1000;
      const [signedUrl] = await storageFile.getSignedUrl({
        version: "v4",
        action: "read",
        expires: expiresAtMs,
      });

      previewUrl = signedUrl;
    }

    return new UploadedFileBuffer(
      this.toReference(bucketName, objectPath),
      previewUrl,
    );
  }

  async deleteFile(storageReference: string): Promise<boolean> {
    const defaultBucketName = this.getBucketName();
    const parsed = this.parseReference(storageReference, defaultBucketName);

    await this.storage
      .bucket(parsed.bucketName)
      .file(parsed.objectPath)
      .delete({ ignoreNotFound: true });

    return true;
  }
}
