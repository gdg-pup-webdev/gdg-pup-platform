import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

console.log("role.update schema:", role.update);

export const body = SchemaFactory.Request.withPayload(role.update);

export const response = {
  200: SchemaFactory.Response.single(role.update),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  roleId: "UUID of the role to update",
};

export const docs_body = {
  data: {
    role_name: "New name for the role (optional)",
    description: "New description for the role (optional)",
  },
};

export const docs_summary = "Update an existing role";
export const docs_description =
  "Update role name or description. Role name must remain unique.";
export const docs_response_200 = "Successfully updated role";
export const docs_response_400 =
  "Bad request - Role name already exists or invalid data";
export const docs_response_404 = "Role not found";
export const docs_response_500 =
  "Internal server error - Failed to update role";
