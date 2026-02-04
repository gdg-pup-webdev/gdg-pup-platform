import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get role";
export const docs_description = [
  "Purpose: Get role.",
  "Inputs: Path params: see schema.",
  "Outputs: Single role.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
