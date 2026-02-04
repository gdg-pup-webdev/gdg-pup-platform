import { profile } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(profile.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create profiles";
export const docs_description = [
  "Purpose: Create profiles.",
  "Inputs: Body: see schema.",
  "Outputs: Single profile.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

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
  "message": "Profile not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No profile found for the provided identifier."
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

export const docs_example_response = {
  "status": "success",
  "message": "Profile created",
  "data": {
    "id": "profile-1",
    "user_id": "user-1",
    "bio": "Building web apps.",
    "program": "Computer Science",
    "year_level": 3,
    "skills_summary": "TypeScript, React, Node",
    "is_public": true,
    "github_url": "https://github.com/user",
    "linkedin_url": "https://linkedin.com/in/user",
    "portfolio_url": "https://example.com",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
};
