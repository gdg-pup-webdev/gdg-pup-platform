import { cz } from "@packages/typed-rest/shared";

export const eventRecord = cz.object({
  id: cz.string().uuid(),
  createdAt: cz.date(),
  updatedAt: cz.date(),

  creatorId: cz.string().uuid(),

  title: cz.string(),
  description: cz.string(),
  category: cz.string(),
  venue: cz.string(),
  start_date: cz.date(),
  end_date: cz.date(),

  attendance_points: cz.number(),
  attendees_count: cz.number(),
  bevy_event_id: cz.string().nullable(),
  image_url: cz.string().nullable(),
  bevyPreviewUrl: cz.string().nullable(),

  short_description: cz.string().nullable(),
  max_capacity: cz.number(),
  tags: cz.array(cz.string()),
  
  // New props
  speakers: cz.array(cz.string()),
  type: cz.string().nullable(),
  teamId: cz.string().uuid().nullable(),
});

export const eventRecordInsertDTO = eventRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  attendees_count: true,
});

export const eventRecordUpdateDTO = eventRecordInsertDTO.partial();
