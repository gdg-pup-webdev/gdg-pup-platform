import { attendance, checkin } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(checkin.insertDTO);

export const response = {
  200: SchemaFactory.Response.single(attendance.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Check in to an event";
export const docs_description = [
  "Purpose: Record an attendee check-in for an event.",
  "Inputs: Body with eventId, attendeeId, checkinMethod.",
  "Outputs: Single attendance record.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");
export const docs_body = "Check-in payload (eventId, attendeeId, checkinMethod).";
export const docs_response_200 = "Check-in recorded successfully.";
export const docs_response_400 = "Invalid check-in payload.";
export const docs_example_body = {
  data: {
    eventId: "event-1",
    attendeeId: "user-2",
    checkinMethod: "NFC",
  },
};
export const docs_example_response = {
  status: "success",
  message: "Check-in successful",
  data: {
    id: "att-1",
    event_id: "event-1",
    user_id: "user-2",
    checkin_method: "NFC",
    is_present: true,
    created_at: "2026-01-10T10:05:00.000Z",
  },
};
