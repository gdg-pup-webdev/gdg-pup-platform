import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SECRET_KEY: 'test-key',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '#models': path.resolve(__dirname, '../../packages/nexus-api-contracts/src/models'),
      '#utils': path.resolve(__dirname, '../../packages/nexus-api-contracts/src/utils'),
      '#types': path.resolve(__dirname, '../../packages/nexus-api-contracts/src/types'),
    },
  },
});