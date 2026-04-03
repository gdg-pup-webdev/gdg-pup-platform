import { userRow, userInsertDTO, userUpdateDTO, userAggregate } from "#models/v1/userSystem/user.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(userRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get one user by ID";
export const docs_description = "Get one user by ID"

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
  message: "UserId not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No userid found for the provided identifier.",
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
  message: "User fetched",
  data: {
    id: "user-1",
    email: "user@example.com",
    gdg_id: "gdg-1",
    display_name: "User One",
    first_name: null,
    last_name: null,
    avatar_url: null,
    status: "active",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  },
};
