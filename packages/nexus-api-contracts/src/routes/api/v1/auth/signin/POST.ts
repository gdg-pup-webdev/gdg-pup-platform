import { signUpRequest, signInRequest, authResponse } from "#models/v1/authSystem/credentials.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  signInRequest,
);

export const response = {
  200: OpenApiSchemas.Response.single(authResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Sign in a user";
export const docs_description =
  "Authenticates a user using email and password.";

export const docs_body = {
  data: {
    email: "User's email address",
    password: "User's password",
  },
};

export const docs_response_200 =
  "Successfully authenticated user and returned session.";
