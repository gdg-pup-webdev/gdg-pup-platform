import {
  projectInsertDTO,
  projectRow,
} from "#models/v1/userResourceSystem/project.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared"; 

/**
 * SCHEMAS
 */
export const files = {
  preview_image: OpenApiSchemas.Models.file(),
};

export const body = OpenApiSchemas.Request.Body.withPayload(projectInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(projectRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

/**
 * DOCS
 */
export const docs_summary = "Create a new project.";
export const docs_description = [
  "Create a new project.",
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
  message: "Project not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No project found for the provided identifier.",
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
