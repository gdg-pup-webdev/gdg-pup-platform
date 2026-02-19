import { file } from "#models/fileSystem/index.js";
import { models } from "#typedrest.contract.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  file.insertDTO,
);

export const files = {
  file: OpenApiSchemas.Models.file(),
};

export const responses = {
  200: OpenApiSchemas.Response.single(models.fileSystem.file.row),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Upload a single file to the server";
