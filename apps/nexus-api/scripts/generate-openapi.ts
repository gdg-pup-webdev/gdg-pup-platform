/**
 * Build-time OpenAPI specification generator.
 *
 * This script generates the OpenAPI JSON spec and writes it to disk during
 * the build phase. By pre-computing the spec at build time, the production
 * server can serve it as a static file, eliminating the V8 heap spike that
 * previously caused OOM crashes when visiting /docs.
 *
 * Usage: tsx scripts/generate-openapi.ts
 * Output: dist/openapi.json
 */

import fs from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { generateOpenApiOptions } from "@packages/nexus-api-contracts";

// This script runs from apps/nexus-api/ (via `tsx scripts/generate-openapi.ts`),
// so process.cwd() correctly resolves to that directory.
const OUTPUT_PATH = path.resolve(process.cwd(), "dist/openapi.json");

console.log("Generating OpenAPI specification...");

const options = generateOpenApiOptions({
  info: {
    title: "Nexus API",
    version: "2.1.0",
    description: [
      "Documentation for the GDG PUP Platform Nexus API.",
      "Auth: Use `Authorization: Bearer <token>` for protected endpoints.",
      "Public endpoints are marked without a lock icon in Swagger.",
    ].join(" "),
  },
  servers: [
    { url: "http://localhost:8000", description: "Local Dev" },
    { url: "https://api.dev.gdgpup.org", description: "Development" },
    { url: "https://api.staging.gdgpup.org", description: "Staging" },
    { url: "https://api.gdgpup.org", description: "Production" },
  ],
  generateExample: true,
});

const spec = swaggerJsdoc(options);

// Ensure output directory exists
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(spec, null, 2), "utf-8");

console.log(`OpenAPI spec written to: ${OUTPUT_PATH}`);
