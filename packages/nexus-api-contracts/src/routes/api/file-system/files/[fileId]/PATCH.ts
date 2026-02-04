import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(file.update);

export const response = {
  200: SchemaFactory.Response.single(file.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update file";
export const docs_description = [
  "Purpose: Update file.",
  "Inputs: Path params: see schema. Body: see schema.",
  "Outputs: Single file.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
