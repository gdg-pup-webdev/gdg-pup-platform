import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/__tests__/**/*.test.ts"],
    env: {
      SUPABASE_URL: "http://localhost", // dummy to satisfy createClient in tests
      SUPABASE_ANON_KEY: "test-key",
    },
  },
});
