import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete article";
export const docs_description = [
  "Purpose: Delete article.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "article-1",
    "title": "Intro to Web Performance",
    "body": "...",
    "author_id": "user-1",
    "is_published": true,
    "published_at": "2026-01-02T00:00:00.000Z",
    "related_event_id": "event-1",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-02T00:00:00.000Z"
  }
};
