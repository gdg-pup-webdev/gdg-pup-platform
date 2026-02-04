import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get certificate";
export const docs_description = [
  "Purpose: Get certificate.",
  "Inputs: Path params: see schema.",
  "Outputs: Single certificate.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
