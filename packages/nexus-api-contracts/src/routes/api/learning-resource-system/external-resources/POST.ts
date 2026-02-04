// create a new study jam
// side effects:
// - create a new event and attatch it to this study jam
//
// todo:
// - remove the reference id on event model. Resources must reference its event, not the other way around
//
//
//

import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(externalResource.insert);

export const response = {
  200: SchemaFactory.Response.single(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create external resources";
export const docs_description = [
  "Purpose: Create external resources.",
  "Inputs: Body: see schema.",
  "Outputs: Single external resource.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "title": "Intro to Web Performance",
    "description": "Performance fundamentals",
    "resource_url": "https://example.com/perf"
  }
};
export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "external-1",
    "title": "Intro to Web Performance",
    "description": "Performance fundamentals",
    "resource_url": "https://example.com/perf",
    "uploader_id": "user-1",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
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
  "message": "External resource not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No external resource found for the provided identifier."
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
