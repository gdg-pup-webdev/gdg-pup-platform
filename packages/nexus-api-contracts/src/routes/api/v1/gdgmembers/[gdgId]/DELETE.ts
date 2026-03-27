import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const docs_summary = "Delete GDG Member";
export const docs_description = "Removes a GDG member record from the system.";

export const response = {
  200: OpenApiSchemas.Response.boolean(),
  ...OpenApiSchemas.Response.standardErrors(),
};
