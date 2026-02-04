import { certificate } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(certificate.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(certificate.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Create certificates";
export const docs_description = [
  "Purpose: Create certificates.",
  "Inputs: Body: see schema.",
  "Outputs: Single certificate.",
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
  "message": "Certificate not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No certificate found for the provided identifier."
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
  "message": "Certificate created",
  "data": {
    "id": "cert-1",
    "title": "Cloud Fundamentals",
    "description": "Completion certificate",
    "image_url": "https://example.com/cert.png",
    "user_id": "user-1"
  }
};
