import { folder } from "#models/v1/fileSystem/folder.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  parentId: cz.string().uuid().nullable().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(folder),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List folders with pagination and optional parentId filtering";
export const docs_description = "Returns a paginated list of folders. Can be filtered by parentId.";
