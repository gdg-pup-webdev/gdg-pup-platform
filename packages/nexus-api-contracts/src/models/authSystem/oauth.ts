import { z } from "zod";

export const oauthRequest = z.object({
  provider: z.enum(["google"]),
  redirect_url: z.string().url().optional(),
});
