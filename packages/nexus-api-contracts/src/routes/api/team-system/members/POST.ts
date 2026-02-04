import { member } from "#models/teamSystem/index.js";
import { row, insert } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const description = "Add a new member to a specific team.";

export const body = SchemaFactory.Request.withPayload(member.insert);

export const response = {
  200: SchemaFactory.Response.single(member.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create members";
export const docs_description = [
  "Purpose: Create members.",
  "Inputs: Body: see schema.",
  "Outputs: Single member.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "team_id": "team-1",
    "user_id": "user-1",
    "role": "member"
  }
};
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
