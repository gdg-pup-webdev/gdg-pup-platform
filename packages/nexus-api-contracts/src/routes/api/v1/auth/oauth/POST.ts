import { oauthRequest } from "#models/v1/authSystem/oauth.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";
import {cz as z} from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(oauthRequest);

export const response = {
  200: OpenApiSchemas.Response.single(
    z.object({
      url: z.string().url(),
    }),
  ),
  ...OpenApiSchemas.Response.standardErrors(),
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
