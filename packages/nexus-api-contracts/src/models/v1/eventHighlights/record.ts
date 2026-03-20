import { cz } from "@packages/typed-rest/shared";

/** Represents an event highlight record as stored in the database. */
export const eventHighlightsRecord = cz.object({
  id: cz.string().uuid(),
  created_at: cz.string().datetime(),
  updated_at: cz.string().datetime(),
  title: cz.string(),
  description: cz.string(),
  content: cz.string(),
  image_url: cz.string().optional().nullable(),
  author_id: cz.string().uuid(),
  event_id: cz.string().uuid(),
});

/** Data Transfer Object for creating a new event highlight. */
export const eventHighlightsRecordInsertDTO = eventHighlightsRecord.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

/** Data Transfer Object for updating an existing event highlight. */
export const eventHighlightsRecordUpdateDTO = eventHighlightsRecordInsertDTO.partial();
