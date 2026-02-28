import { certificateRow, certificateInsertDTO, certificateUpdateDTO } from "#models/v1/userResourceSystem/certificate.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
import { cz as z } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  userId: z.string().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(certificateRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List certificates";
export const docs_description = [
  "Purpose: List certificates.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of certificates with meta.",
  "Errors: 400, 403, 404, 500.",
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
  "message": "Certificates fetched",
  "data": [
    {
      "id": "cert-1",
      "title": "Cloud Fundamentals",
      "description": "Completion certificate",
      "image_url": "https://example.com/cert.png",
      "user_id": "user-1"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
