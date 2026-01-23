export const configs = {
  port: process.env.PORT || 8000,
  devMode: process.env.DEV_MODE === "true",
  clientBaseUrl:
    process.env.CLIENT_URL ||
    (process.env.DEV_MODE === "true" ? "http://localhost:3000" : undefined),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_SECRET_KEY || "",
};
