import {cz as z} from "@packages/typed-rest/shared";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

// No body requirement for logout usually, but we might want to pass the token if not relying on cookies being forwarded automatically by some proxy,
// but typically for an API using Bearer tokens, the token is in the header.
// However, the service method might need the token to sign out the specific session.
// Supabase signOut() signs out the user based on the current session of the client.
// Since we are proxying, we might need to pass the access_token in the Authorization header.

export const body = z.object({});

export const response = {
  200: SchemaFactory.Response.single(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  ),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Sign out user";
export const docs_description =
  "Signs out the authenticated user and invalidates the session.";

export const docs_body = {};

export const docs_response_200 = "User successfully signed out.";
