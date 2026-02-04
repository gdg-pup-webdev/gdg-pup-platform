import { profile } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get profile";
export const docs_description = [
  "Purpose: Get profile.",
  "Inputs: Path params: see schema.",
  "Outputs: Single profile.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
