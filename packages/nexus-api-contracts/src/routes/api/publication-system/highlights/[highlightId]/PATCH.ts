import { highlight } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const body = SchemaFactory.Request.withPayload(highlight.update);

export const response = {
  200: SchemaFactory.Response.single(highlight.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update highlight";
export const docs_description = [
  "Purpose: Update highlight.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single highlight.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
