import { LearningResourceModel } from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(LearningResourceModel),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List learning resources by tag";
export const docs_description = [
  "Purpose: Retrieve a paginated list of learning resources with a specific tag.",
  "Inputs: Path param: tag. Query: pageNumber, pageSize.",
  "Outputs: Paginated list of learning resources.",
].join("\n\n");
