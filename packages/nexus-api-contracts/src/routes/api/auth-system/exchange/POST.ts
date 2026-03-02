import { authCredentials, authExchange } from "#models/authSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  authExchange.exchangeCodeRequest,
);

export const response = {
  200: SchemaFactory.Response.single(authCredentials.authResponse),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Exchange authorization code for session";
export const docs_description =
  "Exchanges an authorization code for user session data.";

export const docs_body = {
  data: {
    code: "The authorization code returned from OAuth provider",
  },
};
