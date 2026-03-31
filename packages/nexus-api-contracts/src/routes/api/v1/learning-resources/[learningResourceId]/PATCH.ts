import {
  LearningResourceModel,
  LearningResourceUpdateModel,
} from "#models/v1/learningResourceSystem/learningResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  LearningResourceUpdateModel,
);

export const files = {
  thumbnailImage: OpenApiSchemas.Models.file(),
};

export const response = {
  200: OpenApiSchemas.Response.single(LearningResourceModel),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update learning resource";
export const docs_description = [
  "Purpose: Update a specific learning resource.",
  "Inputs: Body: see schema. Files: thumbnailImage (optional). Path param learningResourceId.",
  "Outputs: Updated single learning resource.",
].join("\n\n");
