import { loginRequest, loginResponse } from "#models/v1/authentication/index.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(loginRequest);

export const response = {
  200: OpenApiSchemas.Response.single(loginResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Login user";
export const docs_description = "Authenticates user and returns a token.";
