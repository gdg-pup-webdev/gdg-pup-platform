import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete comment";
export const docs_description = [
  "Purpose: Delete comment.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "comment-1",
    "article_id": "article-1",
    "body": "Great post!",
    "user_id": "user-2",
    "created_at": "2026-01-02T10:00:00.000Z",
    "updated_at": "2026-01-02T10:00:00.000Z"
  }
};
