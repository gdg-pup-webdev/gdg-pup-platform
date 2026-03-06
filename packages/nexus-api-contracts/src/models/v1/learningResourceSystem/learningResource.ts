import { cz as z } from "@packages/typed-rest/shared";


export const shape = z.object({
  type: z.string(),
  referenceId: z.string(),
  data: z.record(z.any(), z.any()),
});
