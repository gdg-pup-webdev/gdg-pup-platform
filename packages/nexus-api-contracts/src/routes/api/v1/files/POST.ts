import { fileRecordInsertDTO, fileRecord } from "#models/v1/fileSystem/file.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body =
  OpenApiSchemas.Request.Body.withPayload(fileRecordInsertDTO);

export const files = {
  file: OpenApiSchemas.Models.file(),
};

export const response = {
  200: OpenApiSchemas.Response.single(fileRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Upload a single file to the server";
