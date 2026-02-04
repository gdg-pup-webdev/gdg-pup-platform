import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(article.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List articles";
export const docs_description = [
  "Purpose: List articles.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of articles with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
