import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(role.role);

export const response = {
  200: SchemaFactory.Response.single(role.role),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update an existing role";

export const docs_description =
  "Update the name or description of an existing role. Only provided fields will be updated. Role name must remain unique if changed. This does not affect existing role assignments or permissions.";

export const docs_params = {
  roleId: "UUID of the role to update",
};

export const docs_body = {
  data: {
    role_name: "Optional - New unique name for the role",
    description: "Optional - New description for the role",
  },
};

export const docs_response_200 =
  "Successfully updated role with modified fields";

export const docs_response_400 =
  "Bad request - New role name already exists or invalid data format";

export const docs_response_404 =
  "Not found - Role with specified roleId does not exist";

export const docs_response_500 =
  "Internal server error - Failed to update role in database";
