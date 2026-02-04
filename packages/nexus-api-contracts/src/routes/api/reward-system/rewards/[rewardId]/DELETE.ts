import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete reward";
export const docs_description = [
  "Purpose: Delete reward.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "reward-1",
    "title": "Sticker Pack",
    "description": "GDG sticker set",
    "value": 50,
    "user_id": "user-1",
    "is_claimed": false,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
};
