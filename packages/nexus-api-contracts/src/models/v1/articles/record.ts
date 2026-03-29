import { cz } from "@packages/typed-rest/shared";

/** Represents an article record as stored in the database. */
export const articleRecord = cz.object({
  id: cz.string(),
  created_at: cz.string().datetime(),
  updated_at: cz.string().datetime(),
  title: cz.string(),
  description: cz.string().nullable(),
  content: cz.string(),
  image_url: cz.string().nullable(),
  author_id: cz.string().nullable(),
  event_id: cz.string().nullable(),
  is_published: cz.boolean(),
  published_at: cz.string().datetime().nullable(),
});

/** Data Transfer Object for creating a new article. */
export const articleRecordInsertDTO = articleRecord.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/** Data Transfer Object for updating an existing article. */
export const articleRecordUpdateDTO = articleRecordInsertDTO.partial();
