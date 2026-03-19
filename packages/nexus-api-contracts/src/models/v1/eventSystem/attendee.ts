/**
 * @file attendee.ts
 * @description Zod model definitions for the Event Attendee entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents an event attendee (a user record in the context of event attendance). */
export const eventAttendeeRow = cz.object({
  id: cz.string(),
  event_id: cz.string(),
  user_id: cz.string(),
  checkin_method: cz.string(),
  is_present: cz.boolean(),
  created_at: cz.string(),
});
