export const configs = {
  port: process.env.PORT || 8100,
  devMode: process.env.DEV_MODE === "true",
  clientBaseUrl:
    process.env.CLIENT_URL ||
    (process.env.DEV_MODE === "true" && "http://localhost:3000"),
  supabaseUrl: process.env.SUPABASE_URL || "No Url",
  supabaseKey: process.env.SUPABASE_SECRET_KEY || "No Key",
};
