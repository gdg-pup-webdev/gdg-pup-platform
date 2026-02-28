import { fileRecord } from "#models/v1/fileSystem/file.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(fileRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};
