import { cz as z } from "@packages/typed-rest/shared";


export const exchangeCodeRequest = z.object({
  code: z.string().optional(),
  access_token: z.string().optional(),
  refresh_token: z.string().optional(),
});
