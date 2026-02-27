import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

/**
 * DOCUMENTATIONS
 */
export const docs_summary = "Get the roles of the user.";
export const docs_description = "Get the roles of the user.";

/**
 * SCHEMAS
 */
export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    roleId: cz.string(),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.single(cz.boolean()),
  ...OpenApiSchemas.Response.standardErrors(),
};
