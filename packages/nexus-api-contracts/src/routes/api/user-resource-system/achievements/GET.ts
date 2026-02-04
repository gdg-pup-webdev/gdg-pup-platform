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
