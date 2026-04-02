import { LearningResourceModel } from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = cz.object({
  q: cz.string(),
  limit: cz.coerce.number().optional().default(10),
});

export const response = {
  200: OpenApiSchemas.Response.single(cz.array(LearningResourceModel)),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Search learning resources";
export const docs_description = [
  "Purpose: Search for matching or similar learning resources.",
  "Inputs: Query: q (search string), limit (optional).",
  "Outputs: Array of matching learning resources.",
].join("\n\n");
