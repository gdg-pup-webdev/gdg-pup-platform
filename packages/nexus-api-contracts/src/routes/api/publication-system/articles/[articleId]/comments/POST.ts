import { articleComment } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(articleComment.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(articleComment.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create comments";
export const docs_description = [
  "Purpose: Create comments.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single comment.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
