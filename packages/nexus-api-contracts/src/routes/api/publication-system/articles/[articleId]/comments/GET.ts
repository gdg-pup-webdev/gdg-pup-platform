import { articleComment } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(articleComment.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get comment";
export const docs_description = [
  "Purpose: Get comment.",
  "Inputs: Path params: see schema. Query params: see schema.",
  "Outputs: Paginated list of comments with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
