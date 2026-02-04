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
