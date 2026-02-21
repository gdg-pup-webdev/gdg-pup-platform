import {
  metadataKeys,
  omitSchema,
  safeOmit,
  standardMetadata,
} from "#utils/model.utils.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = standardMetadata.extend({
  // event data
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
});

export const insert = row.omit(metadataKeys);

export const update = insert.partial();
