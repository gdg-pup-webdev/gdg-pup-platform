import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const docs_summary = "Make GDG Member Profile Public";
export const docs_description = "Sets the GDG member's profile visibility to public.";

export const response = {
  200: OpenApiSchemas.Response.boolean(),
  ...OpenApiSchemas.Response.standardErrors(),
};
