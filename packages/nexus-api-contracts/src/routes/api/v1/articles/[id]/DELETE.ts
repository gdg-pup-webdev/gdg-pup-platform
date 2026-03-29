import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete an article";
export const docs_description = "Deletes an article record by its ID.";
