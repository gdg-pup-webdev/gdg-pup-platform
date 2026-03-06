/**
 * @file resource.ts
 * @description Zod model definitions for the External Resource entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full external resource record. */
export const externalResourceRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  uploader_id: cz.string(),

  title: cz.string(),
  description: cz.string().nullable(),
  resource_url: cz.string(),
});

/** Data Transfer Object for creating a new external resource. */
export const externalResourceInsertDTO = externalResourceRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

/** Data Transfer Object for updating an existing external resource. */
export const externalResourceUpdateDTO = externalResourceInsertDTO.partial();
