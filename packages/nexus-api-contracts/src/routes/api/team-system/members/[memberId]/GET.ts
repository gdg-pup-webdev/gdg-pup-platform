import { row } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { member } from "#models/teamSystem/index.js";

export const response = {
  200: SchemaFactory.Response.single(member.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get member";
export const docs_description = [
  "Purpose: Get member.",
  "Inputs: Path params: see schema.",
  "Outputs: Single member.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
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
