import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(file.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List files";
export const docs_description = [
  "Purpose: List files.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of files with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
