import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get setting";
export const docs_description = [
  "Purpose: Get setting.",
  "Inputs: Path params: see schema.",
  "Outputs: Single setting.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
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
  "message": "SettingsId not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No settingsid found for the provided identifier."
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
  "message": "Settings fetched",
  "data": {
    "id": "settings-1",
    "user_id": "user-1",
    "color_theme": true
  }
};
