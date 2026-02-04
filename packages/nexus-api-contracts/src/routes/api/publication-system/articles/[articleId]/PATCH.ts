import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(article.update);

export const response = {
  200: SchemaFactory.Response.single(article.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update article";
export const docs_description = [
  "Purpose: Update article.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single article.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "title": "Updated article title"
  }
};
export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "article-1",
    "title": "Updated article title",
    "body": "...",
    "author_id": "user-1",
    "is_published": true,
    "published_at": "2026-01-02T00:00:00.000Z",
    "related_event_id": "event-1",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-02T00:00:00.000Z"
  }
};
