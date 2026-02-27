import { cz as z } from "@packages/typed-rest/shared";


export const oauthRequest = z.object({
  provider: z.enum(["google"]),
  redirect_url: z.string().url().optional(),
});
