/**
 * @file attendance.ts
 * @description Zod model definitions for the Event Attendance entity.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full event attendance record. */
export const eventAttendanceRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),

  event_id: cz.string(),
  user_id: cz.string(),

  checkin_method: cz.string(),
  is_present: cz.boolean(),
});

/** Data Transfer Object for creating a new event attendance record. */
export const eventAttendanceInsertDTO = eventAttendanceRow.omit({
  id: true,
  created_at: true,
  is_present: true,
});

/** Data Transfer Object for updating an existing event attendance record. */
export const eventAttendanceUpdateDTO = eventAttendanceInsertDTO.partial();
