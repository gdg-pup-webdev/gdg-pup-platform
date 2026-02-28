/**
 * @file article.ts
 * @description Zod model definitions for the Article entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full article record. */
export const articleRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  author_id: cz.string().nullable(),
  related_event_id: cz.string().nullable(),

  title: cz.string(),
  body: cz.string().nullable(),
  is_published: cz.boolean(),
  published_at: cz.string().nullable(),
});

/** Data Transfer Object for creating a new article. */
export const articleInsertDTO = articleRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
  author_id: true,
  is_published: true,
  published_at: true,
});

/** Data Transfer Object for updating an existing article. */
export const articleUpdateDTO = articleInsertDTO.partial();
