import { file } from "#models/fileSystem/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const responses = {
  200: OpenApiSchemas.Response.paginated(file.row),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List files with pagination";
