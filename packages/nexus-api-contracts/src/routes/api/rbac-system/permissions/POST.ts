import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";

export const body = SchemaFactory.Request.withPayload(permission.insert);

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create a new permission";

export const docs_description =
  "Create a new permission entry in the RBAC system. Permissions define what actions (read, write, update, delete) a role can perform on a specific resource. Duplicate permissions (same role + resource combination) are not allowed.";

export const docs_body = {
  data: {
    user_role_id: "UUID of the role this permission belongs to (required)",
    resource_name:
      "Name of the resource (e.g., 'events', 'users', 'comments') - must be unique per role",
    can_read: "Boolean - Whether the role can read/view this resource",
    can_write:
      "Boolean - Whether the role can create new instances of this resource",
    can_update:
      "Boolean - Whether the role can modify existing instances of this resource",
    can_delete:
      "Boolean - Whether the role can delete instances of this resource",
  },
};

export const docs_response_200 =
  "Successfully created permission with generated UUID";

export const docs_response_400 =
  "Bad request - Permission already exists for this role+resource or invalid data";

export const docs_response_500 =
  "Internal server error - Failed to create permission";
