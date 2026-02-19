import { authCredentials } from "#models/authSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  authCredentials.signInRequest,
);

export const response = {
  200: SchemaFactory.Response.single(authCredentials.authResponse),
  ...SchemaFactory.Response.standardErrors(),
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
