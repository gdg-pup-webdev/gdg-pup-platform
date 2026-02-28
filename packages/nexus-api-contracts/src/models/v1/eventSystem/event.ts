import { cz } from "@packages/typed-rest/shared";

export const eventRecord = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  creator_id: cz.string(),

  title: cz.string(),
  description: cz.string(),
  image_url: cz.string().nullable(),
  venue: cz.string().nullable(),
  category: cz.string().nullable(),
  start_date: cz.string().nullable(),
  end_date: cz.string().nullable(),
  attendance_points: cz.number(),

  attendees_count: cz.number(),
});

export const eventRecordInsertDTO = eventRecord.omit({
  id: true,
  created_at: true,
  updated_at: true,
  creator_id: true,
  attendees_count: true,
});

export const eventRecordUpdateDTO = eventRecordInsertDTO.partial();
