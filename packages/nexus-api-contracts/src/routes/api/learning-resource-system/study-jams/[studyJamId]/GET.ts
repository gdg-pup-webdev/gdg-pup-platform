// get a specific study jam
import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get study jam";
export const docs_description = [
  "Purpose: Get study jam.",
  "Inputs: Path params: see schema.",
  "Outputs: Single study jam.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "studyjam-1",
    "title": "Study Jam: TypeScript",
    "description": "Hands-on TypeScript session",
    "summary": "Covers types, narrowing, and inference.",
    "recording_url": "https://example.com/recording",
    "created_at": "2026-01-02T00:00:00.000Z"
  }
};
