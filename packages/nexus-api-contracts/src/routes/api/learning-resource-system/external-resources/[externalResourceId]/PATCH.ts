// update the study jam
//
import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(externalResource.update);

export const response = {
  200: SchemaFactory.Response.single(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update external resource";
export const docs_description = [
  "Purpose: Update external resource.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single external resource.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
