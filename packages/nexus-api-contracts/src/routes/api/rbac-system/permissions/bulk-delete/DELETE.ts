import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = z.object({
  permissionIds: z.array(z.string().uuid()).min(1),
});

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete multiple permissions in bulk";

export const docs_description =
  "Permanently delete multiple permissions at once from the RBAC system. This is useful for cleaning up permissions, removing access from a role, or reconfiguring role capabilities. All specified permissions will be deleted atomically. Users with roles containing these permissions will immediately lose the associated access.";

export const docs_body = {
  permissionIds: "Array of permission UUIDs to delete (minimum 1 required)",
};

export const docs_response_200 =
  "Successfully deleted all specified permissions";

export const docs_response_400 =
  "Bad request - Empty array provided or invalid UUID format in array";

export const docs_response_404 =
  "Not found - One or more permissions with specified IDs do not exist";

export const docs_response_500 =
  "Internal server error - Failed to delete permissions from database";
