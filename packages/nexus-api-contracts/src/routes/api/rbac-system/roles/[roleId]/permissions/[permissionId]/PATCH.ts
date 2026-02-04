import { permission, role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(permission.update),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update permission";
export const docs_description = [
  "Purpose: Update permission.",
  "Inputs: Path params: see schema.",
  "Outputs: Single permission.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
