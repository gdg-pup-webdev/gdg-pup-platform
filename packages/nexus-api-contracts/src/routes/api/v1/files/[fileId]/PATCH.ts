import { file } from "#models/fileSystem/index.js"; 
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  file.updateDTO
);

export const files = {
  file: OpenApiSchemas.Models.file(),
};

export const responses = {
  200: OpenApiSchemas.Response.single(file.row),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update a single file";
