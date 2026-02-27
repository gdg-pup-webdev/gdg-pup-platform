import { signUpRequest, signInRequest, authResponse } from "#models/v1/authSystem/credentials.js";
import { exchangeCodeRequest } from "#models/v1/authSystem/exchange.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  exchangeCodeRequest,
);

export const response = {
  200: OpenApiSchemas.Response.single(authResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Exchange authorization code for session";
export const docs_description =
  "Exchanges an authorization code for user session data.";

export const docs_body = {
  data: {
    code: "The authorization code returned from OAuth provider",
  },
};
