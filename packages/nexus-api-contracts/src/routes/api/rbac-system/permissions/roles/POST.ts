import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  permissionData: permission.insert.omit({
    user_role_id: true,
  }),
  roleId: z.string(),
});

export const response = {
  200: SchemaFactory.Response.single(permission.select),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Assign a permission to a role";

export const docs_description =
  "Create and assign a new permission to a specific role. This is a convenience endpoint that automatically sets the role ID. Duplicate permissions (same role + resource) are not allowed.";

export const docs_body = {
  roleId: "UUID of the role to assign this permission to (required)",
  permissionData: {
    resource_name:
      "Name of the resource (e.g., 'events', 'users') - must be unique per role",
    can_read: "Boolean - Whether the role can read/view this resource",
    can_write: "Boolean - Whether the role can create new instances",
    can_update: "Boolean - Whether the role can modify existing instances",
    can_delete: "Boolean - Whether the role can delete instances",
  },
};

export const docs_response_200 = "Successfully assigned permission to role";

export const docs_response_400 =
  "Bad request - Permission already exists for this role+resource or invalid data";

export const docs_response_404 =
  "Not found - Role with specified ID does not exist";

export const docs_response_500 =
  "Internal server error - Failed to assign permission";
