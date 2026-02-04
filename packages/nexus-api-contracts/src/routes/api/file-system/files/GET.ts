import { file } from "#models/fileSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(file.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List files";
export const docs_description = [
  "Purpose: List files.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of files with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": [
    {
      "id": "file-1",
      "title": "Banner",
      "creatorId": "user-1",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "previewUrl": "https://example.com/preview.png",
      "downloadUrl": "https://example.com/download.png",
      "bucketRef": "assets/banners/file-1.png"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
