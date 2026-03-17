import { teamResourceUpdateDTO, teamResource } from "#models/v1/teamResourceSystem/teamResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(teamResourceUpdateDTO);

export const files = {
  thumbnail_image: OpenApiSchemas.Models.file(),
};

export const response = {
  200: OpenApiSchemas.Response.single(teamResource),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an existing team resource";
export const docs_description = "Partially updates a team resource. Optionally updates the thumbnail image.";
