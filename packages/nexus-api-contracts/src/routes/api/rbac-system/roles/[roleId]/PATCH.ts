import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(role.update),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update role";
export const docs_description = [
  "Purpose: Update role.",
  "Inputs: Path params: see schema.",
  "Outputs: Single role.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
