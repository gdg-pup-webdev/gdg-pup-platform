import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(certificate.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update certificate";
export const docs_description = [
  "Purpose: Update certificate.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single certificate.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
