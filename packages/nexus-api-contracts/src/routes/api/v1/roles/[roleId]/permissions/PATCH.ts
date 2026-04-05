import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    resource: cz.string(),
    action: cz.string(),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.boolean(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Remove permission from a role";

export const docs_description = "Remove permission from a role";
