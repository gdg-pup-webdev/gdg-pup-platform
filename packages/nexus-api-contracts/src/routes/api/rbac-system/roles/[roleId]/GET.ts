import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get a single role by ID";
export const docs_description =
  "Retrieve detailed information about a specific role including its permissions.";
export const docs_response_200 = "Successfully retrieved role details";
export const docs_response_404 = "Role not found";
export const docs_response_500 =
  "Internal server error - Failed to retrieve role";
