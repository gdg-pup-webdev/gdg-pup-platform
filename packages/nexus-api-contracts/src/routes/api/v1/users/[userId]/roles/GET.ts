import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz } from "@packages/typed-rest/shared";

/**
 * DOCUMENTATIONS
 */
export const docs_summary = "Get the roles of the user.";
export const docs_description = "Get the roles of the user.";
export const docs_params = {
  roleId: "UUID of the role to retrieve",
};
export const docs_response_200 = "Successfully retrieved role details";
export const docs_response_400 = "Bad request - Invalid UUID format for roleId";
export const docs_response_404 =
  "Not found - No role exists with the provided roleId";
export const docs_response_500 =
  "Internal server error - Failed to retrieve role from database";

/**
 * SCHEMAS
 */
export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(
    cz.object({
      id: cz.string(),
      name: cz.string(),
      description: cz.string(),
    }),
  ),
  ...OpenApiSchemas.Response.standardErrors(),
};
