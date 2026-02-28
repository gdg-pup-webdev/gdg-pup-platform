/**
 * @file articleComment.ts
 * @description Zod model definitions for the Article Comment entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full article comment record. */
export const articleCommentRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  article_id: cz.string().nullable(),
  user_id: cz.string().nullable(),

  body: cz.string(),
});

/** Data Transfer Object for creating a new article comment. */
export const articleCommentInsertDTO = articleCommentRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

/** Data Transfer Object for updating an existing article comment. */
export const articleCommentUpdateDTO = articleCommentInsertDTO.partial();
