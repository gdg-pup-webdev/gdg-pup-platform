import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(file.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get file";
export const docs_description = [
  "Purpose: Get file.",
  "Inputs: Path params: see schema.",
  "Outputs: Single file.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
