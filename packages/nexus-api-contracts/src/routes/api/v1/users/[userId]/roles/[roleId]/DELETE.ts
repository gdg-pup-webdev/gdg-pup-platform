import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz } from "@packages/typed-rest/shared";

/**
 * DOCS
 */
export const docs_summary = "Remove a role from a user";

export const docs_description = "Remove a role from a user";

export const docs_response_200 =
  "Successfully deleted role and all associated assignments";

export const docs_response_400 = "Bad request - Invalid UUID format for roleId";

export const docs_response_404 =
  "Not found - Role with specified roleId does not exist";

export const docs_response_500 =
  "Internal server error - Failed to delete role from database";

/**
 * SCHEMAS
 */
export const response = {
  200: OpenApiSchemas.Response.single(cz.boolean()),
  ...OpenApiSchemas.Response.standardErrors(),
};
