import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().nullable().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List roles with optional user filter";

export const docs_description =
  "Retrieve a paginated list of roles in the RBAC system. When userId is provided, returns only roles assigned to that specific user. Otherwise, returns all available roles in the system.";

export const docs_query = {
  userId:
    "Optional - UUID of user to filter roles by (returns only roles assigned to this user)",
  pageNumber: "Page number for pagination (default: 1, minimum: 1)",
  pageSize: "Number of items per page (default: 10, minimum: 1, maximum: 100)",
};

export const docs_response_200 =
  "Successfully retrieved paginated list of roles";

export const docs_response_400 =
  "Bad request - Invalid query parameters (e.g., invalid UUID format, negative page numbers)";

export const docs_response_500 =
  "Internal server error - Failed to retrieve roles from database";
