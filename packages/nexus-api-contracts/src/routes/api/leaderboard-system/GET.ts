import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List resource";
export const docs_description = [
  "Purpose: List resource.",
  "Inputs: None.",
  "Outputs: Empty response.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
