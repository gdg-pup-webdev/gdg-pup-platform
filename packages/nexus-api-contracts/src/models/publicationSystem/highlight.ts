import {
  metadataKeys,
  omitSchema,
  safeOmit,
  standardMetadata,
} from "#utils/model.utils.js";
import { cz as z } from "@packages/typed-rest/shared";


export const row = standardMetadata.extend({
  // event data
  title: z.string().openapi({
    description: "The title of the highlighted achievement or news.",
    example: "New Community Milestone reached!",
  }),
  description: z.string().openapi({
    description: "A detailed explanation of the highlight.",
  }),
  date: z.string().openapi({
    description: "The date associated with the highlight.",
  }),
});

export const insert = row.omit(metadataKeys);

export const update = insert.partial();
