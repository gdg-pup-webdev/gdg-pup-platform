import { user } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(user.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get user";
export const docs_description = [
  "Purpose: Get user.",
  "Inputs: Path params: see schema.",
  "Outputs: Single user.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
