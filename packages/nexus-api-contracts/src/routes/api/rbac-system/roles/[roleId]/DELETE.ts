import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  roleId: "UUID of the role to delete",
};

export const docs_summary = "Delete a role";
export const docs_description =
  "Delete a role from the system. Cannot delete roles that are currently assigned to users.";
export const docs_response_200 = "Successfully deleted role";
export const docs_response_400 =
  "Bad request - Role is still assigned to users";
export const docs_response_404 = "Role not found";
export const docs_response_500 =
  "Internal server error - Failed to delete role";
