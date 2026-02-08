import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(permission.update);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update an existing permission";

export const docs_description =
  "Update specific fields of an existing permission. You can modify the resource name or any of the permission flags (can_read, can_write, can_update, can_delete). Only provided fields will be updated.";

export const docs_params = {
  permissionId: "UUID of the permission to update",
};

export const docs_body = {
  data: {
    resource_name: "Optional - Update the resource name",
    can_read: "Optional - Update read permission",
    can_write: "Optional - Update write/create permission",
    can_update: "Optional - Update modification permission",
    can_delete: "Optional - Update deletion permission",
  },
};

export const docs_response_200 =
  "Successfully updated permission with modified fields";

export const docs_response_400 =
  "Bad request - Invalid permission data provided";

export const docs_response_404 =
  "Not found - Permission with specified ID does not exist";

export const docs_response_500 =
  "Internal server error - Failed to update permission";
