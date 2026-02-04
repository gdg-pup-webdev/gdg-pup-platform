import { role } from "#models/rbacSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().nullable().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(role.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List roles";
export const docs_description = [
  "Purpose: List roles.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of roles with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
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
  message: "Role not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No role found for the provided identifier.",
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
  message: "Roles fetched",
  data: [
    {
      id: "role-1",
      role_name: "admin",
      description: "Administrator role",
    },
  ],
  meta: {
    totalRecords: 1,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
  },
};
