import { attendee } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  user_id: z.string().optional(),
  checkin_method: z.string().optional(),
  is_present: z.coerce.boolean().optional(),
  created_at_gte: z.string().optional(),
  created_at_lte: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(attendee.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List event attendees";
export const docs_description = [
  "Purpose: Retrieve attendees for a specific event with optional filters.",
  "Inputs: Path param eventId. Query params pageNumber, pageSize, user_id, checkin_method, is_present, created_at_gte, created_at_lte.",
  "Outputs: Paginated list of attendees with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_params = {
  eventId: "The event ID.",
};
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  user_id: "Optional. Filter by attendee user ID.",
  checkin_method: "Optional. Filter by check-in method.",
  is_present: "Optional. Filter by attendance status.",
  created_at_gte: "Optional. Filter check-ins created on/after this date-time.",
  created_at_lte: "Optional. Filter check-ins created on/before this date-time.",
};
export const docs_response_200 = "Paginated list of attendees.";

export const docs_example_response = {
  "status": "success",
  "message": "Fetched successfully",
  "data": [
    {
      "id": "user-1",
      "email": "user@example.com",
      "gdg_id": "gdg-1",
      "display_name": "User One",
      "first_name": null,
      "last_name": null,
      "avatar_url": null,
      "status": "active",
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "totalRecords": 1,
    "pageSize": 10,
    "currentPage": 1,
    "totalPages": 1
  }
};
