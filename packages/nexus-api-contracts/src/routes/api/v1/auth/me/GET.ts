import { signUpRequest, signInRequest, authResponse } from "#models/v1/authSystem/credentials.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(authResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get current user";
export const docs_description =
  "Returns the current user and session based on the auth token.";
