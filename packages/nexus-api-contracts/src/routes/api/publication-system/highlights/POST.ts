import { highlight } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(highlight.insert);

export const response = {
  200: SchemaFactory.Response.single(highlight.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create highlights";
export const docs_description = [
  "Purpose: Create highlights.",
  "Inputs: Body: see schema.",
  "Outputs: Single highlight.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
