import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(certificate.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create certificates";
export const docs_description = [
  "Purpose: Create certificates.",
  "Inputs: Body: see schema.",
  "Outputs: Single certificate.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
