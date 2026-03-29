import { articleRecord } from "#models/v1/articles/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(articleRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get an article";
export const docs_description = "Returns a single article record by its ID.";
