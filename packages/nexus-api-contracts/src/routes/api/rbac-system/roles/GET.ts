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

export const docs_summary = "List all roles";
export const docs_description =
  "Retrieve a paginated list of roles. Optionally filter by userId to get roles assigned to a specific user.";
export const docs_response_200 =
  "Successfully retrieved list of roles with pagination metadata";
export const docs_response_400 = "Bad request - Invalid query parameters";
export const docs_response_500 =
  "Internal server error - Failed to retrieve roles";
