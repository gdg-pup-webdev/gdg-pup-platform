import { role } from "#models/rbacSystem/index.js";
import { user } from "#models/userSystem/index.js";
import { z } from "zod";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query().extend({
  roleId: z.string(),
  withoutRoles: z.boolean(),
});

export const response = {
  200: SchemaFactory.Response.paginated(
    z.object({
      user: user.row,
      roles: z.array(role.row),
    }),
  ),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List users with their assigned roles";

export const docs_description =
  "Retrieve a paginated list of users along with their assigned roles. Each user object includes an array of roles they have been assigned. Can be filtered to show only users with a specific role, or users without any roles assigned.";

export const docs_query = {
  pageNumber: "Page number for pagination (default: 1, minimum: 1)",
  pageSize: "Number of items per page (default: 10, minimum: 1, maximum: 100)",
  roleId:
    "Optional - UUID of specific role to filter by (returns only users who have this role)",
  withoutRoles:
    "Optional - Set to 'true' to return only users who have no roles assigned",
};

export const docs_response_200 =
  "Successfully retrieved paginated list of users with their roles";

export const docs_response_400 =
  "Bad request - Invalid query parameters or conflicting filters (roleId and withoutRoles cannot both be set)";

export const docs_response_404 = "Not found - Specified roleId does not exist";

export const docs_response_500 =
  "Internal server error - Failed to retrieve users from database";
