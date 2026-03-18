import { fileRecord } from "#models/v1/fileSystem/file.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  path: cz.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(fileRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List files with pagination and optional path filtering";
