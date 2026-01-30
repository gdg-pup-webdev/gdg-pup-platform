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

export const docs_summary = "List Achievements";
export const docs_description = "Retrieves a paginated list of achievements. Can be filtered by user ID.";
export const docs_query = {
  pageNumber: "The page number to retrieve.",
  pageSize: "The number of items per page.",
  userId: "Optional. The ID of the user to filter achievements for.",
};
export const docs_response_200 = "Successfully retrieved the list of achievements.";