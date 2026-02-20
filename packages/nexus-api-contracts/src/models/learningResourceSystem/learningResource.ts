import { cz as z } from "@packages/typed-rest/shared";


export const shape = z.object({
  type: z.string().openapi({
    description: "The category or format of the learning resource (e.g., 'external', 'study_jam').",
    example: "study_jam",
  }),
  referenceId: z.string().openapi({
    description: "The unique ID of the specific resource (e.g., the ID of the Study Jam or External Resource).",
  }),
  data: z.record(z.any(), z.any()).openapi({
    description: "Additional metadata or serialized data associated with the resource.",
  }),
});
