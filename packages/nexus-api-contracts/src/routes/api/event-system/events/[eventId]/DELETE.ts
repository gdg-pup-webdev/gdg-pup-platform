import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "Delete event";
export const docs_description = [
  "Purpose: Delete event.",
  "Inputs: Path params: see schema.",
  "Outputs: Single event.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Requires Bearer token.",
].join("\n\n");

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": {
    "id": "event-1",
    "title": "Intro Workshop",
    "description": null,
    "start_date": "2026-01-10T10:00:00.000Z",
    "end_date": "2026-01-10T12:00:00.000Z",
    "venue": "Auditorium",
    "category": "workshop",
    "attendance_points": 10,
    "attendees_count": 0,
    "creator_id": "user-1",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-01T00:00:00.000Z"
  }
};
