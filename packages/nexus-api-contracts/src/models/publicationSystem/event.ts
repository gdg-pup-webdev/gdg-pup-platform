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
    description: "The name of the featured event.",
    example: "Annual GDG Hackathon",
  }),
  description: z.string().openapi({
    description: "A summary of the featured event.",
  }),
  startDate: z.string().openapi({
    description: "When the featured event starts.",
  }),
  endDate: z.string().openapi({
    description: "When the featured event ends.",
  }),
  location: z.string().openapi({
    description: "Where the featured event takes place.",
  }),
});

export const insert = row.omit(metadataKeys);

export const update = insert.partial();
