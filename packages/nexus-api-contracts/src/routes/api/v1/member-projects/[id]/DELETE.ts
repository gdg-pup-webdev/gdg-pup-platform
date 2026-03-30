import { OpenApiSchemas } from "@packages/typed-rest/shared";
 
export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete a member project";
export const docs_description = "Permanently deletes a member project from the system.";
