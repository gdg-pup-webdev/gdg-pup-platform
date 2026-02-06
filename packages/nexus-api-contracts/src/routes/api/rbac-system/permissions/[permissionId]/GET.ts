import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { permission } from "#models/rbacSystem/index.js";

export const response = {
  200: SchemaFactory.Response.single(permission.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get a single permission by ID";

export const docs_description =
  "Retrieve detailed information about a specific permission using its UUID. Returns the permission's resource name, CRUD capabilities (can_create, can_read, can_update, can_delete), associated role, and metadata.";

export const docs_params = {
  permissionId: "UUID of the permission to retrieve",
};

export const docs_response_200 = "Successfully retrieved permission details";

export const docs_response_400 =
  "Bad request - Invalid UUID format for permissionId";

export const docs_response_404 =
  "Not found - No permission exists with the provided permissionId";

export const docs_response_500 =
  "Internal server error - Failed to retrieve permission from database";
