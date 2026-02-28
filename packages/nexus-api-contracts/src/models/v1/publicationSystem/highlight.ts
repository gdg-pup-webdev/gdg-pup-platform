/**
 * @file highlight.ts
 * @description Zod model definitions for the Highlight entity.
 */

import {
  metadataKeys,
  standardMetadata,
} from "#utils/model.utils.js";
import { cz as z } from "@packages/typed-rest/shared";

/** Represents a full highlight record. */
export const highlightRow = standardMetadata.extend({
  title: z.string(),
  description: z.string(),
  date: z.string(),
});

/** Data Transfer Object for creating a new highlight. */
export const highlightInsertDTO = highlightRow.omit(metadataKeys);

/** Data Transfer Object for updating an existing highlight. */
export const highlightUpdateDTO = highlightInsertDTO.partial();
