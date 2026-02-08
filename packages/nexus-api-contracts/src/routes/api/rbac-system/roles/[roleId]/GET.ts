import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get a single role by ID";

export const docs_description =
  "Retrieve detailed information about a specific role using its UUID. Returns the role's name, description, and metadata.";

export const docs_params = {
  roleId: "UUID of the role to retrieve",
};

export const docs_response_200 = "Successfully retrieved role details";

export const docs_response_400 = "Bad request - Invalid UUID format for roleId";

export const docs_response_404 =
  "Not found - No role exists with the provided roleId";

export const docs_response_500 =
  "Internal server error - Failed to retrieve role from database";
