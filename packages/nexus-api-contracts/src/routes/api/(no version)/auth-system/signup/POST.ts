import { authCredentials } from "#models/v0/authSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  authCredentials.signUpRequest,
);

export const response = {
  201: SchemaFactory.Response.single(authCredentials.authResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Sign up a new user";
export const docs_description =
  "Creates a new user account using Supabase Auth and triggers a verification email.";

export const docs_body = {
  data: {
    email: "User's email address",
    password: "User's password (min 6 chars)",
    display_name: "Optional display name",
  },
};

export const docs_response_201 =
  "Successfully created user account. Verification email sent.";
