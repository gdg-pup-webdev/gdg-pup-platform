import { authOAuth } from "#models/v0/authSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import {cz as z} from "@packages/typed-rest/shared";

export const body = SchemaFactory.Request.withPayload(authOAuth.oauthRequest);

export const response = {
  200: SchemaFactory.Response.single(
    z.object({
      url: z.string().url(),
    }),
  ),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Initiate OAuth flow";
export const docs_description =
  "Returns the OAuth provider URL to redirect the user to.";

export const docs_body = {
  data: {
    provider: "The OAuth provider (google, github, azure)",
    redirect_url: "Optional URL to redirect back to after auth",
  },
};
