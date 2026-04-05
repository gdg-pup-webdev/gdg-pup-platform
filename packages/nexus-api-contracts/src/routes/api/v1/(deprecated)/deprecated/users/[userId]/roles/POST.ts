import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

/**
 * DOCUMENTATIONS
 */
export const docs_summary = "Attach roles to user.";
export const docs_description = "Attach roles to user.";

/**
 * SCHEMAS
 */
export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    roleName: cz.string(),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.single(cz.boolean()),
  ...OpenApiSchemas.Response.standardErrors(),
};
