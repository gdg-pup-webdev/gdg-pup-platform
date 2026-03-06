/**
 * @file event.ts
 * @description Zod model definitions for the Publication Event entity.
 */

import {
  metadataKeys,
  standardMetadata,
} from "#utils/model.utils.js";
import { cz as z } from "@packages/typed-rest/shared";

/** Represents a full publication event record. */
export const publicationEventRow = standardMetadata.extend({
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
});

/** Data Transfer Object for creating a new publication event. */
export const publicationEventInsertDTO = publicationEventRow.omit(metadataKeys);

/** Data Transfer Object for updating an existing publication event. */
export const publicationEventUpdateDTO = publicationEventInsertDTO.partial();
