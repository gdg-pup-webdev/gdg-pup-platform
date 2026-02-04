import { row, insert } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(insert);

export const response = {
  200: SchemaFactory.Response.single(row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create teams";
export const docs_description = [
  "Purpose: Create teams.",
  "Inputs: Body: see schema.",
  "Outputs: Single team.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "name": "Engineering",
    "description": "Core engineering team"
  }
};
export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "team-1",
    "name": "Engineering",
    "description": "Core engineering team"
  }
};
