import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete a role";

export const docs_description =
  "Permanently delete a role from the RBAC system. This will also remove all user-role assignments and associated permissions. Use with caution as this action cannot be undone.";

export const docs_params = {
  roleId: "UUID of the role to delete",
};

export const docs_response_200 =
  "Successfully deleted role and all associated assignments";

export const docs_response_400 = "Bad request - Invalid UUID format for roleId";

export const docs_response_404 =
  "Not found - Role with specified roleId does not exist";

export const docs_response_500 =
  "Internal server error - Failed to delete role from database";
