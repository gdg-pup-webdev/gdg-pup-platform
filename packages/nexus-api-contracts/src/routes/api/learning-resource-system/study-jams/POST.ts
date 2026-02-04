// create a new study jam
// side effects:
// - create a new event and attatch it to this study jam
//
// todo:
// - remove the reference id on event model. Resources must reference its event, not the other way around
//
//
//
import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(studyJam.insert);

export const response = {
  200: SchemaFactory.Response.single(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create study jams";
export const docs_description = [
  "Purpose: Create study jams.",
  "Inputs: Body: see schema.",
  "Outputs: Single study jam.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_body = {
  "data": {
    "title": "Study Jam: TypeScript",
    "description": "Hands-on TypeScript session",
    "summary": "Covers types, narrowing, and inference.",
    "recording_url": "https://example.com/recording"
  }
};
export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "studyjam-1",
    "title": "Study Jam: TypeScript",
    "description": "Hands-on TypeScript session",
    "summary": "Covers types, narrowing, and inference.",
    "recording_url": "https://example.com/recording",
    "created_at": "2026-01-02T00:00:00.000Z"
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
  "message": "Study jam not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No study jam found for the provided identifier."
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
