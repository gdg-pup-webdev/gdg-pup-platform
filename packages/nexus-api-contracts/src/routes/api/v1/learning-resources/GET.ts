import { LearningResourceModel } from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  search: cz.string().optional(),
  type: cz.enum(["studyJam", "external", "blog"]).optional(),
  teamId: cz.string().uuid().optional(),
  eventId: cz.string().uuid().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(LearningResourceModel),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List learning resources";
export const docs_description = [
  "Purpose: List learning resources with pagination and filters.",
  "Inputs: Query: search, type, teamId, eventId, pageNumber, pageSize.",
  "Outputs: Paginated list of learning resources.",
].join("\n\n");
