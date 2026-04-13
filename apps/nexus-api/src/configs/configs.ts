export const configs = {
  port: process.env.PORT || 8000,
  devMode: process.env.DEV_MODE === "true",
  clientBaseUrl:
    process.env.CLIENT_URL ||
    (process.env.DEV_MODE === "true" ? "http://localhost:3000" : undefined),
  supabase: {
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET || "public",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
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
  },
  hideApiDocs: process.env.HIDE_API_DOCS === "true" || false,
};
