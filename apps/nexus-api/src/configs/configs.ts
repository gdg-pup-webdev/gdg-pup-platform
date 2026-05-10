import { gcsStorageConfigs } from "@/v1/lib/gcsStorage/gcsStorageConfigs";

const toFileStorageProvider = (
  value: string | undefined,
): "supabase" | "gcs" => {
  const normalized = value?.trim().toLowerCase();

  if (normalized === "supabase") {
    return "supabase";
  }

  return "gcs";
};

const useProdDb = process.env.USE_PRODUCTION_DATABASE === "true" || false;

export const configs = {
  port: process.env.PORT || 8000,
  devMode: process.env.DEV_MODE === "true",
  clientBaseUrl:
    process.env.CLIENT_URL ||
    (process.env.DEV_MODE === "true" ? "http://localhost:3000" : undefined),
  supabase: {
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || "public",
    supabaseUrl: useProdDb ? process.env.PROD_SUPABASE_URL : process.env.SUPABASE_URL,
    supabaseKey: useProdDb ? process.env.PROD_SUPABASE_SECRET_KEY : process.env.SUPABASE_SECRET_KEY,
  },
  fileStorage: {
    mainProvider: toFileStorageProvider(process.env.FILE_STORAGE_MAIN_PROVIDER),
  },
  gcp: gcsStorageConfigs,
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
  },
  session: {
    timeoutMinutes: parseInt(process.env.SESSION_TIMEOUT_MINUTES || "10080", 10),
  },
  zeptoMail: {
    url: process.env.ZEPTOMAIL_URL || "https://api.zeptomail.com/v1.1/email",
    token: process.env.ZEPTOMAIL_TOKEN || "",
    from: {
      address: process.env.ZEPTOMAIL_FROM_ADDRESS || "noreply@gdgpup.org",
      name: process.env.ZEPTOMAIL_FROM_NAME || "GDG PUP",
    },
  },
  security: {
    disabled: process.env.SECURITY_DISABLED === "true" || false,
    serviceApiKey: process.env.SERVICE_API_KEY,
  },
  hideApiDocs: process.env.HIDE_API_DOCS === "true" || false,
};
