import { project } from "#models/userResourceSystem/index.js";
import { profile } from "#models/userSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  userId: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List user profiles";
export const docs_description = [
  "Purpose: Retrieve user profiles with optional user filtering.",
  "Inputs: Query params pageNumber, pageSize, userId.",
  "Outputs: Paginated list of profiles with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  userId: "Optional. Filter by user ID.",
};
export const docs_example_response = {
  status: "success",
  message: "Profiles fetched successfully",
  data: [
    {
      id: "profile-1",
      user_id: "user-1",
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
