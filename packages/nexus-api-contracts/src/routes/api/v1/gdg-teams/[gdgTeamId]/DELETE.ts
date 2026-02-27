import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.empty(),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete team";
export const docs_description = [
  "Purpose: Delete team.",
  "Inputs: Path params: see schema.",
  "Outputs: Empty response.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Deleted successfully",
  "data": {
    "id": "team-1",
    "name": "Engineering",
    "description": "Core engineering team"
  }
};

export const docs_example_response_400 = {
  "status": "error",
  "message": "Invalid request.",
  "errors": [
    {
      "title": "Bad Request",
      "detail": "One or more request fields are invalid."
    }
  ]
};
export const docs_example_response_401 = {
  "status": "error",
  "message": "Unauthorized.",
  "errors": [
    {
      "title": "Unauthorized",
      "detail": "Missing or invalid authentication token."
    }
  ]
};
export const docs_example_response_403 = {
  "status": "error",
  "message": "Forbidden.",
  "errors": [
    {
      "title": "Forbidden",
      "detail": "You do not have permission to access this resource."
    }
  ]
};
export const docs_example_response_404 = {
  "status": "error",
  "message": "TeamId not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No teamid found for the provided identifier."
    }
  ]
};
export const docs_example_response_500 = {
  "status": "error",
  "message": "Internal server error.",
  "errors": [
    {
      "title": "Internal Server Error",
      "detail": "An unexpected error occurred."
    }
  ]
};
