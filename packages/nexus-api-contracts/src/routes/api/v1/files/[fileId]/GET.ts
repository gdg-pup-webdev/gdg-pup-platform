import { file } from "#models/fileSystem/index.js";
import { models } from "#typedrest.contract.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(file.row),
  ...OpenApiSchemas.Response.standardErrors(),
};
