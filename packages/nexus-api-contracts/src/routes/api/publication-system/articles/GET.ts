import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(article.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List articles";
export const docs_description = [
  "Purpose: List articles.",
  "Inputs: Query params: see schema.",
  "Outputs: Paginated list of articles with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": [
    {
      "id": "article-1",
      "title": "Intro to Web Performance",
      "body": "...",
      "author_id": "user-1",
      "is_published": true,
      "published_at": "2026-01-02T00:00:00.000Z",
      "related_event_id": "event-1",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-02T00:00:00.000Z"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
