// get a specific study jam
// get a specific study jam
import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get external resource";
export const docs_description = [
  "Purpose: Get external resource.",
  "Inputs: Path params: see schema.",
  "Outputs: Single external resource.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "external-1",
    "title": "Intro to Web Performance",
    "description": "Performance fundamentals",
    "resource_url": "https://example.com/perf",
    "uploader_id": "user-1",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
};
