import { fileRecordUpdateDTO, fileRecord } from "#models/v1/fileSystem/file.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body =
  OpenApiSchemas.Request.Body.withPayload(fileRecordUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(fileRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update a single file";
