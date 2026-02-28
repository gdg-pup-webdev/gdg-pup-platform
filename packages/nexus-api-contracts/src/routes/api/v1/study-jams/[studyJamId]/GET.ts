// get a specific study jam
import { studyJamRow } from "#models/v1/learningResourceSystem/studyJam.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(studyJamRow),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get study jam";
export const docs_description = [
  "Purpose: Get study jam.",
  "Inputs: Path params: see schema.",
  "Outputs: Single study jam.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  status: "success",
  message: "Fetched successfully",
  data: {
    id: "studyjam-1",
    title: "Study Jam: TypeScript",
    description: "Hands-on TypeScript session",
    summary: "Covers types, narrowing, and inference.",
    recording_url: "https://example.com/recording",
    created_at: "2026-01-02T00:00:00.000Z",
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
  message: "StudyJamId not found.",
  errors: [
    {
      title: "Not Found",
      detail: "No studyjamid found for the provided identifier.",
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
