import { authCredentials } from "#models/v0/authSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(authCredentials.authResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Get current user";
export const docs_description =
  "Returns the current user and session based on the auth token.";
