import { articleComment } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(articleComment.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(articleComment.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create comments";
export const docs_description = [
  "Purpose: Create comments.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single comment.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "article_id": "article-1",
    "body": "Great post!",
    "user_id": "user-2"
  }
};
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
