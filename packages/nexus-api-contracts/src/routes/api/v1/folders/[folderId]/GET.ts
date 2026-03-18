import { folder } from "#models/v1/fileSystem/folder.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  folderId: cz.string().uuid(),
});

export const response = {
  200: OpenApiSchemas.Response.single(folder),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a single folder by ID";
export const docs_description = "Returns the details of a specific folder.";
