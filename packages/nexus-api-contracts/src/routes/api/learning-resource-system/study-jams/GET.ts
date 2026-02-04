// list study jams
import { studyJam } from "#models/learningResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const query = SchemaFactory.Request.Paginated.query();

export const response = {
  200: SchemaFactory.Response.paginated(studyJam.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List study jams";
export const docs_description = [
  "Purpose: Retrieve study jams with optional filters.",
  "Inputs: Query params pageNumber, pageSize, search, createdFrom, createdTo.",
  "Outputs: Paginated list of study jams with meta.",
  "Errors: 400, 401, 403, 404, 500.",
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
