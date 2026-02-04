import { role } from "#models/rbacSystem/index.js";
import { user } from "#models/rbacSystem/index.js";
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

export const docs_query = {
  pageNumber: "Current page number (1-indexed)",
  pageSize: "Number of items per page",
  roleId: "Optional role ID to filter users who have this specific role",
  withoutRoles: "Optional boolean to filter users who have no roles assigned",
};

export const docs_summary = "List users with their assigned roles";
export const docs_description =
  "Retrieve a paginated list of users with their assigned roles. Can filter by specific role or users without any roles.";
export const docs_response_200 =
  "Successfully retrieved users with their roles";
export const docs_response_400 = "Bad request - Invalid query parameters";
export const docs_response_404 =
  "Not found - either Users do not exist or roles specified not exist";
export const docs_response_500 =
  "Internal server error - Failed to retrieve users";
