import { highlight } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.single(highlight.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get highlight";
export const docs_description = [
  "Purpose: Get highlight.",
  "Inputs: Path params: see schema.",
  "Outputs: Single highlight.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
