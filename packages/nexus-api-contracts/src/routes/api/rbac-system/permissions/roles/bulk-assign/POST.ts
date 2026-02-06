import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";
import { z } from "zod";

export const body = z.object({
  permissionData: z.array(permission.insert),
});

export const response = {
  200: SchemaFactory.Response.list(permission.select),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Bulk assign multiple permissions to a role";

export const docs_description =
  "Assign multiple permissions to a role in a single transaction. This is more efficient than making multiple individual requests. All permissions must have unique resource names for the specified role.";

export const docs_body = {
  roleId: "UUID of the role to assign these permissions to (required)",
  permissionData: [
    {
      resource_name: "Name of the resource (e.g., 'events', 'users')",
      can_read: "Boolean - Read permission flag",
      can_write: "Boolean - Write/create permission flag",
      can_update: "Boolean - Update permission flag",
      can_delete: "Boolean - Delete permission flag",
    },
    "... additional permission objects",
  ],
};

export const docs_response_200 =
  "Successfully assigned all permissions to role";

export const docs_response_400 =
  "Bad request - One or more permissions already exist or invalid data";

export const docs_response_404 =
  "Not found - Role with specified ID does not exist";

export const docs_response_500 =
  "Internal server error - Failed to assign permissions";
