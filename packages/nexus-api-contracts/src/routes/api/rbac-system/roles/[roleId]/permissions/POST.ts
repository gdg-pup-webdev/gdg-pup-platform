import { permission, role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(permission.insert);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create permissions";
export const docs_description = [
  "Purpose: Create permissions.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single permission.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
