import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(article.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get article";
export const docs_description = [
  "Purpose: Get article.",
  "Inputs: Path params: see schema.",
  "Outputs: Single article.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
