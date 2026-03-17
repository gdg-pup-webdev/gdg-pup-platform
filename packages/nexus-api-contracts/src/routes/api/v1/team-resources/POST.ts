import { teamResourceInsertDTO, teamResource } from "#models/v1/teamResourceSystem/teamResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(teamResourceInsertDTO);

export const files = {
  thumbnail_image: OpenApiSchemas.Models.file(),
};

export const response = {
  201: OpenApiSchemas.Response.single(teamResource),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create a new team resource";
export const docs_description = "Creates a new team resource with a thumbnail image.";
