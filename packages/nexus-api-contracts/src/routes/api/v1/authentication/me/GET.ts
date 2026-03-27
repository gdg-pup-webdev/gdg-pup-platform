import { meResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(meResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get current authenticated user";
export const docs_description = "Returns the profile of the currently authenticated user based on the JWT token.";
