// list study jams
// list study jams
import { externalResource } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  search: z.string().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  uploaderId: z.string().optional(),
  tagIds: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(externalResource.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List external resources";
export const docs_description = [
  "Purpose: Retrieve external learning resources with optional filters.",
  "Inputs: Query params pageNumber, pageSize, search, createdFrom, createdTo, uploaderId, tagIds.",
  "Outputs: Paginated list of external resources with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  search: "Optional. Search by title or description.",
  createdFrom: "Optional. Filter by created_at on/after this date-time.",
  createdTo: "Optional. Filter by created_at on/before this date-time.",
  uploaderId: "Optional. Filter by uploader ID.",
  tagIds: "Optional. CSV tag IDs filter (match-any), e.g. tag-1,tag-2.",
};
export const docs_response_200 = "Paginated list of external resources.";
export const docs_example_response = {
  status: "success",
  message: "Resources fetched successfully",
  data: [
    {
      id: "external-1",
      title: "Intro to Web Performance",
      description: "Performance fundamentals",
      resource_url: "https://example.com/perf",
      uploader_id: "user-1",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  meta: {
    totalRecords: 1,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
  },
};

export const docs_example_response_400 = {
  status: "error",
  message: "Invalid request.",
  errors: [
    {
      title: "Bad Request",
      detail: "One or more request fields are invalid.",
    },
  ],
};
export const docs_example_response_401 = {
  status: "error",
  message: "Unauthorized.",
  errors: [
    {
      title: "Unauthorized",
      detail: "Missing or invalid authentication token.",
    },
  ],
};
export const docs_example_response_403 = {
  status: "error",
  message: "Forbidden.",
  errors: [
    {
      title: "Forbidden",
      detail: "You do not have permission to access this resource.",
    },
  ],
};
export const docs_example_response_404 = {
  status: "error",
  message: "External resource not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No external resource found for the provided identifier.",
    },
  ],
};
export const docs_example_response_500 = {
  status: "error",
  message: "Internal server error.",
  errors: [
    {
      title: "Internal Server Error",
      detail: "An unexpected error occurred.",
    },
  ],
};
