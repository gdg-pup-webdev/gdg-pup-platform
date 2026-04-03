import { LearningResourceModel } from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(LearningResourceModel),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get learning resource by ID";
export const docs_description = [
  "Purpose: Retrieve a specific learning resource.",
  "Inputs: Path param learningResourceId.",
  "Outputs: Single learning resource.",
].join("\n\n");
