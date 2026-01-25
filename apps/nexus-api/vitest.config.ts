/**
 * @file vitest.config.ts
 * @description Configuration for the Vitest test runner.
 * Configures path aliases to match the application's tsconfig and
 * sets up the environment for integration testing.
 */

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    /** Run tests in a Node.js environment */
    environment: "node",
    /** Path aliases for clean imports during testing */
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    include: ["src/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    /** Load environment variables before running tests */
    env: {
      SUPABASE_URL: "http://localhost:54321",
      SUPABASE_SECRET_KEY: "test-key",
    },
  },
});
