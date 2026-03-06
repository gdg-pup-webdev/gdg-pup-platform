import { cz } from "@packages/typed-rest/shared";

export const ScrapedGdgEventsObject = cz.object({
  id: cz.string(),
  title: cz.string(),
  short_description: cz.string().optional(),
  bevy_url: cz.string().optional(),
  start_date: cz.string(),
  end_date: cz.string(),
  location: cz.string().optional(),
  cover_image_url: cz.string().optional(),
  status: cz.string().optional(),
  event_type: cz.string().optional(),
  created_at: cz.string().optional(),
  updated_at: cz.string().optional(),
  description: cz.string().optional(),
  tags: cz.array(cz.string()).optional(),
  attendees: cz.number().optional(),
  total_capacity: cz.number().optional(),
  attendee_virtual_venue_url: cz.string().optional(),
  event_type_slug: cz.string().optional(),
  video_url: cz.string().optional(),
  is_virtual_event: cz.boolean().optional(),
});
