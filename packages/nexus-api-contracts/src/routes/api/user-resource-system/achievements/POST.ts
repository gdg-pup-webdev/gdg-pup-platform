import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(achievement.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create achievements";
export const docs_description = [
  "Purpose: Create achievements.",
  "Inputs: Body: see schema.",
  "Outputs: Single achievement.",
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
  "message": "Achievement not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No achievement found for the provided identifier."
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
  "message": "Achievement created",
  "data": {
    "id": "ach-1",
    "title": "First Event",
    "description": "Attended first event",
    "image_url": "https://example.com/ach.png",
    "achieved_at": "2026-01-01T00:00:00.000Z",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z",
    "user_id": "user-1"
  }
};
