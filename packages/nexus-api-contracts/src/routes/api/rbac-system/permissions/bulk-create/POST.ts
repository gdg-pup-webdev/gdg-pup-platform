import { permission } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = SchemaFactory.Request.withPayload(
  z.array(permission.insert),
);

export const response = {
  200: SchemaFactory.Response.list(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create multiple permissions in bulk";

export const docs_description =
  "Create multiple permissions at once for efficient permission setup. This is useful when setting up a new role with many permissions or migrating permission configurations. All permissions in the array will be created atomically - if any fail, none will be created. Each permission must have a unique combination of user_role_id and resource_name.";

export const docs_body = {
  data: [
    {
      user_role_id: "UUID of the role (required for each permission)",
      resource_name: "Resource name (required for each permission)",
      can_create: "Boolean - Create permission",
      can_read: "Boolean - Read permission",
      can_update: "Boolean - Update permission",
      can_delete: "Boolean - Delete permission",
    },
  ],
};

export const docs_response_200 =
  "Successfully created all permissions - returns array of created permission objects";

export const docs_response_400 =
  "Bad request - One or more permissions already exist, or invalid data format in array";

export const docs_response_404 =
  "Not found - One or more specified roles do not exist";

export const docs_response_500 =
  "Internal server error - Failed to create permissions in database";
