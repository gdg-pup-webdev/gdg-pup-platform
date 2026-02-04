import { row, update } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(update);

export const response = {
  200: SchemaFactory.Response.single(row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update team";
export const docs_description = [
  "Purpose: Update team.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single team.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
