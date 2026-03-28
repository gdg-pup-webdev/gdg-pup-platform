import { LearningResourceInsertModel, LearningResourceModel } from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(LearningResourceInsertModel);
export const files ={
  thumbnailImage:  OpenApiSchemas.Models.file(),
};

export const response = {
  200: OpenApiSchemas.Response.single(LearningResourceModel),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create learning resources";
export const docs_description = [
  "Purpose: Create learning resources.",
  "Inputs: Body: see schema. Files: thumbnailImage (optional).",
  "Outputs: Single learning resource.",
  "Errors: 400, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
