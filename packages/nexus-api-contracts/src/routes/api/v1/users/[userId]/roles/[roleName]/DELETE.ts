import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz } from "@packages/typed-rest/shared";

/**
 * DOCS
 */
export const docs_summary = "Remove a role from a user";

export const docs_description = "Remove a role from a user";
 
/**
 * SCHEMAS
 */
export const response = {
  200: OpenApiSchemas.Response.single(cz.boolean()),
  ...OpenApiSchemas.Response.standardErrors(),
};
