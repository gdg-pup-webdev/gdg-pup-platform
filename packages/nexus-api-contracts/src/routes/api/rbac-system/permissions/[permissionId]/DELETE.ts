import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete a permission";

export const docs_description =
  "Permanently delete a permission from the RBAC system. This removes the permission entry entirely. Use with caution as this action cannot be undone.";

export const docs_params = {
  permissionId: "UUID of the permission to delete",
};

export const docs_response_200 = "Successfully deleted permission";

export const docs_response_404 =
  "Not found - Permission with specified ID does not exist";

export const docs_response_500 =
  "Internal server error - Failed to delete permission";
