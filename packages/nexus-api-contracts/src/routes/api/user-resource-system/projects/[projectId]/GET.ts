import { project } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.single(project.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get project";
export const docs_description = [
  "Purpose: Get project.",
  "Inputs: Path params: see schema. Query params: see schema.",
  "Outputs: Single project.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
