import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List achievements";
export const docs_description = [
  "Purpose: Retrieve achievements with optional user filtering.",
  "Inputs: Query params pageNumber, pageSize, userId.",
  "Outputs: Paginated list of achievements with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\\n\\n");
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  userId: "Optional. Filter by user ID.",
};
export const docs_response_200 = "Paginated list of achievements.";

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
  "message": "Achievements fetched",
  "data": [
    {
      "id": "ach-1",
      "title": "First Event",
      "description": "Attended first event",
      "image_url": "https://example.com/ach.png",
      "achieved_at": "2026-01-01T00:00:00.000Z",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z",
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
