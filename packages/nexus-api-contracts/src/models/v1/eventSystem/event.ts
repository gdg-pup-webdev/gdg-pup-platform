import { cz } from "@packages/typed-rest/shared";

export const eventRecord = cz.object({
  id: cz.string().uuid(),
  createdAt: cz.string(),
  updatedAt: cz.string(),

  creatorId: cz.string().uuid(),

  title: cz.string(),
  description: cz.string(),
  category: cz.string(),
  venue: cz.string(),
  start_date: cz.string(),
  end_date: cz.string(),

  attendance_points: cz.number(),
  attendees_count: cz.number(),
  bevy_event_id: cz.string().nullable().optional(),
  image_url: cz.string().nullable().optional(),
  bevyPreviewUrl: cz.string().nullable().optional(),

  short_description: cz.string().nullable().optional(),
  max_capacity: cz.number(),
  tags: cz.array(cz.string()),
  
  // New props
  speakers: cz.array(cz.string()),
  type: cz.string().nullable().optional(),
  teamId: cz.string().uuid().nullable().optional(),
});

export const eventRecordInsertDTO = eventRecord.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  attendees_count: true,
});

export const eventRecordUpdateDTO = eventRecordInsertDTO.partial();
