 import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = SchemaFactory.Request.withArrayPayload(role.permission);

export const response = {
  200: SchemaFactory.Response.single(role.roleAggregate),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create multiple permissions in bulk";

export const docs_description =
  "Assign multiple permissions to a role in a single transaction. This is more efficient than making multiple individual requests. All permissions must have unique resource names for the specified role.";

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
