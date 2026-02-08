 import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const body = SchemaFactory.Request.withArrayPayload(role.permission);

export const response = {
  200: SchemaFactory.Response.single(role.roleAggregate),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete multiple permissions in bulk";

export const docs_description =
  "Remove multiple permissions from a role in a single transaction. All specified permissions must belong to the given role. This is more efficient than making multiple individual requests.";

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
