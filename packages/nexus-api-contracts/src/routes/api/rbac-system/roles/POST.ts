import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(role.insert);

export const response = {
  200: SchemaFactory.Response.single(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create roles";
export const docs_description = [
  "Purpose: Create roles.",
  "Inputs: Body: see schema.",
  "Outputs: Single role.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
