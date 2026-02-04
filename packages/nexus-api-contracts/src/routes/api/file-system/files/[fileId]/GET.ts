import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(file.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get file";
export const docs_description = [
  "Purpose: Get file.",
  "Inputs: Path params: see schema.",
  "Outputs: Single file.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "file-1",
    "title": "Banner",
    "creatorId": "user-1",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "previewUrl": "https://example.com/preview.png",
    "downloadUrl": "https://example.com/download.png",
    "bucketRef": "assets/banners/file-1.png"
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
  "message": "FileId not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No fileid found for the provided identifier."
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
