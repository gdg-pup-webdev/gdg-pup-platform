import { teamResource } from "#models/v1/teamResourceSystem/teamResource.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(teamResource),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get team resource by ID";
export const docs_description = "Retrieve a single team resource by its unique identifier.";
