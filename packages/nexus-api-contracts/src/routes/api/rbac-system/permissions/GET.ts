import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
  roleId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List permissions with optional filters";

export const docs_description =
  "Retrieve a paginated list of permissions. Can be filtered by role ID or user ID. When filtering by user ID, returns all permissions from all roles assigned to that user.";

export const docs_query = {
  userId:
    "Optional - Filter permissions by user ID (returns all permissions from user's roles)",
  roleId: "Optional - Filter permissions by role ID",
  pageNumber: "Page number for pagination (default: 1)",
  pageSize: "Number of items per page (default: 10)",
};

export const docs_response_200 =
  "Successfully retrieved paginated list of permissions";

export const docs_response_400 = "Bad request - Invalid query parameters";

export const docs_response_500 =
  "Internal server error - Failed to retrieve permissions";
