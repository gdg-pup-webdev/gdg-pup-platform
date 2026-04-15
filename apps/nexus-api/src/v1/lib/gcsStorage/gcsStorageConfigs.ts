

const toFileStorageProvider = (
  value: string | undefined,
): "supabase" | "gcp" => {
  if (value?.trim().toLowerCase() === "gcp") {
    return "gcp";
  }

  return "supabase";
};

const toPreviewUrlType = (
  value: string | undefined,
): "signed" | "public" => {
  if (value?.trim().toLowerCase() === "public") {
    return "public";
  }

  return "signed";
};

const toUploadPrefix = (value: string | undefined): string => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "uploads";
  }

  return trimmed.replace(/^\/+|\/+$/g, "");
};

const toPublicBaseUrl = (value: string | undefined): string => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return "https://storage.googleapis.com";
  }

  return trimmed.replace(/\/+$/g, "");
};

const toPositiveInt = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value || "", 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return fallback;
};



export const gcsStorageConfigs = {
  projectId: process.env.GCP_PROJECT_ID || "",
    bucketName: process.env.GCS_BUCKET_NAME || "",
    credentialsFile: process.env.GCS_CREDENTIALS_FILE || "",
    uploadPrefix: toUploadPrefix(process.env.GCS_UPLOAD_PREFIX),
    publicBaseUrl: toPublicBaseUrl(process.env.GCS_PUBLIC_BASE_URL),
    previewUrlType: toPreviewUrlType(process.env.GCS_PREVIEW_URL_TYPE),
    signedUrlExpiresSeconds: toPositiveInt(
      process.env.GCS_SIGNED_URL_EXPIRES_SECONDS,
      900,
    ),
    makePublicOnUpload: process.env.GCS_MAKE_PUBLIC_ON_UPLOAD === "true",
  }