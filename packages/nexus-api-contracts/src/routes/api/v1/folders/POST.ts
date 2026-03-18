import { folder, folderInsertDTO } from "#models/v1/fileSystem/folder.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(folderInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(folder),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create a new folder";
export const docs_description = "Creates a new folder with an optional parentId.";
