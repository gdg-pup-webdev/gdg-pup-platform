import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = SchemaFactory.Request.withPayload(
  z.object({
    userId: z.string(),
  }),
);

export const response = {
  200: SchemaFactory.Response.list(role.role),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Remove a role from a user";

export const docs_description =
  "Remove a specific role assignment from a user, revoking all permissions associated with that role. The user will retain any other roles they have assigned.";

export const docs_params = {
  roleId: "UUID of the role to remove from the user",
};

export const docs_body = {
  userId: "UUID of the user to remove the role from",
};

export const docs_response_200 = "Successfully removed role from user";

export const docs_response_400 =
  "Bad request - Invalid UUID format for roleId or userId";

export const docs_response_404 =
  "Not found - User-role assignment does not exist (user may not have this role assigned)";

export const docs_response_500 =
  "Internal server error - Failed to remove role assignment from database";
