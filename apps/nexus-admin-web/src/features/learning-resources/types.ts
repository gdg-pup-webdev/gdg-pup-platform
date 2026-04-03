import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

export type LearningResource = contract.api.v1.learning_resources.GET.response[200]["data"][number];
export type LearningResourcesResponse = contract.api.v1.learning_resources.GET.response[200];
export type LearningResourcesQueryParams = z.infer<typeof contract.api.v1.learning_resources.GET.request.query>;
export type CreateLearningResourceDTO = z.infer<typeof contract.api.v1.learning_resources.POST.request.body>["data"];
export type UpdateLearningResourceDTO = z.infer<typeof contract.api.v1.learning_resources.learningResourceId.PATCH.request.body>["data"];

export class LearningResourcesException extends Error {
  constructor(
    public message: string,
    public code: string = "LEARNING_RESOURCES_ERROR",
    public detail?: string
  ) {
    super(message);
    this.name = "LearningResourcesException";
  }
}
