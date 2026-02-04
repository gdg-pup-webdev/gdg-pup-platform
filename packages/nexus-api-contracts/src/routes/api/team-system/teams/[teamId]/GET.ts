import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get team";
export const docs_description = [
  "Purpose: Get team.",
  "Inputs: Path params: see schema.",
  "Outputs: Single team.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "team-1",
    "name": "Engineering",
    "description": "Core engineering team"
  }
};
