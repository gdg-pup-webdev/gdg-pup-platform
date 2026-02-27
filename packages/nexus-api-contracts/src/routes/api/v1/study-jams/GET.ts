// list study jams
 import { studyJamRow } from "#models/v1/learningResourceSystem/studyJam.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared"; 

export const query = OpenApiSchemas.Request.Query.paginated() 

export const response = {
  200: OpenApiSchemas.Response.paginated( studyJamRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List study jams";
export const docs_description = [
  "Purpose: Retrieve study jams with optional filters.",
  "Inputs: Query params pageNumber, pageSize, search, createdFrom, createdTo.",
  "Outputs: Paginated list of study jams with meta.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  search: "Optional. Search by title, summary, or description.",
  createdFrom: "Optional. Filter by created_at on/after this date-time.",
  createdTo: "Optional. Filter by created_at on/before this date-time.",
};
export const docs_response_200 = "Paginated list of study jams.";

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
  message: "Study jam not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No study jam found for the provided identifier.",
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

export const docs_example_response = {
  status: "success",
  message: "Study jams fetched",
  data: [
    {
      id: "studyjam-1",
      title: "Study Jam: TypeScript",
      description: "Hands-on TypeScript session",
      summary: "Covers types, narrowing, and inference.",
      recording_url: "https://example.com/recording",
      created_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  meta: {
    totalRecords: 1,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
  },
};
