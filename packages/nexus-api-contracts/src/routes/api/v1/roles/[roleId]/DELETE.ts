import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.boolean(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a role";

export const docs_description = "Delete a role";
 