import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete member";
export const docs_description = [
  "Purpose: Delete member.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "member-1",
    "role": "member",
    "team_id": "team-1",
    "user_id": "user-1"
  }
};
