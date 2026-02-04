import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(article.insert);

export const response = {
  200: SchemaFactory.Response.single(article.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create articles";
export const docs_description = [
  "Purpose: Create articles.",
  "Inputs: Body: see schema.",
  "Outputs: Single article.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
