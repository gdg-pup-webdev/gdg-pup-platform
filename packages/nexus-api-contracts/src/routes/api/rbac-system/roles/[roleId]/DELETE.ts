import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete role";
export const docs_description = [
  "Purpose: Delete role.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
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
  message: "Role deleted",
  data: {
    id: "role-1",
    role_name: "admin",
    description: "Administrator role",
  },
};
