import { z } from "zod";

export const exchangeCodeRequest = z.object({
  code: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
});
