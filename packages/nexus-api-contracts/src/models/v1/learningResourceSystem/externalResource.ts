/**
 * @file externalResource.ts
 * @description Zod model definitions for the Learning Resource (External Resource) entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full learning resource record. */
export const learningResource = cz.object({
  id: cz.string(),
  updated_at: cz.string(),
  created_at: cz.string(),

  uploader_id: cz.string(),

  title: cz.string(),
  description: cz.string().nullable(),
  thumbnail_url: cz.string(),
  resource_url: cz.string(),
});

/** Data Transfer Object for creating a new learning resource. */
export const learningResourceInsertDTO = learningResource.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

/** Data Transfer Object for updating an existing learning resource. */
export const learningResourceUpdateDTO = learningResourceInsertDTO.partial();
