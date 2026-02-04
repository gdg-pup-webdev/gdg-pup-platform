import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

console.log("role.update schema:", role.update);

export const body = SchemaFactory.Request.withPayload(role.update);

export const response = {
  200: SchemaFactory.Response.single(role.update),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Update role";
export const docs_description = [
  "Purpose: Update role.",
  "Inputs: Path params: see schema.",
  "Outputs: Single role.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response_400 = {
  status: "error",
  message: "Invalid request.",
  errors: [
    {
      title: "Bad Request",
      detail: "One or more request fields are invalid.",
    },
  ],
};
export const docs_example_response_401 = {
  status: "error",
  message: "Unauthorized.",
  errors: [
    {
      title: "Unauthorized",
      detail: "Missing or invalid authentication token.",
    },
  ],
};
export const docs_example_response_403 = {
  status: "error",
  message: "Forbidden.",
  errors: [
    {
      title: "Forbidden",
      detail: "You do not have permission to access this resource.",
    },
  ],
};
export const docs_example_response_404 = {
  status: "error",
  message: "RoleId not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No roleid found for the provided identifier.",
    },
  ],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [
    {
      title: "Internal Server Error",
      detail: "An unexpected error occurred.",
    },
  ],
};

export const docs_example_response = {
  status: "success",
  message: "Role updated",
  data: {
    id: "role-1",
    role_name: "editor",
    description: "Administrator role",
  },
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
