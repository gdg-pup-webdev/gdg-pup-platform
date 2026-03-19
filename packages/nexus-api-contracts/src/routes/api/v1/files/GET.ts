import { fileRecord } from "#models/v1/fileSystem/file.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  folderId: cz.string().uuid().nullable().optional(),
  path: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(fileRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List files with pagination and optional folder filtering";
export const docs_description = "Returns a paginated list of files. Can be filtered by folderId.";
