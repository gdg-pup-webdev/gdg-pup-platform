import { event } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(event.update);

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update event";
export const docs_description = [
  "Purpose: Update event.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single event.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
