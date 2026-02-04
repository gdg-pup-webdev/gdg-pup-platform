import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

import { z } from "zod";

export const query = SchemaFactory.Request.Paginated.query().extend({
  creator_id: z.string().optional(),
  category: z.string().optional(),
  venue: z.string().optional(),
  start_date_gte: z.string().optional(),
  start_date_lte: z.string().optional(),
  end_date_gte: z.string().optional(),
  end_date_lte: z.string().optional(),
});

export const response = {
  200: SchemaFactory.Response.paginated(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_summary = "List events";
export const docs_description = [
  "Purpose: Retrieve events with optional filtering.",
  "Inputs: Query params pageNumber, pageSize, creator_id, category, venue, start_date_gte, start_date_lte, end_date_gte, end_date_lte.",
  "Outputs: Paginated list of events with meta.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\n\n");
export const docs_query = {
  pageNumber: "Page number (default: 1).",
  pageSize: "Page size (default: 10, max: 50).",
  creator_id: "Optional. Filter by creator user ID.",
  category: "Optional. Filter by event category.",
  venue: "Optional. Filter by venue.",
  start_date_gte: "Optional. Filter events starting on/after this date-time.",
  start_date_lte: "Optional. Filter events starting on/before this date-time.",
  end_date_gte: "Optional. Filter events ending on/after this date-time.",
  end_date_lte: "Optional. Filter events ending on/before this date-time.",
};
export const docs_response_200 = "Paginated list of events.";
export const docs_example_response = {
  status: "success",
  message: "Events fetched successfully",
  data: [
    {
      id: "event-1",
      title: "Intro Workshop",
      description: null,
      start_date: "2026-01-10T10:00:00.000Z",
      end_date: "2026-01-10T12:00:00.000Z",
      venue: "Auditorium",
      category: "workshop",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    },
  ],
  meta: {
    totalRecords: 1,
    pageSize: 10,
    currentPage: 1,
    totalPages: 1,
  },
};

export const docs_example_response_400 = {
  "status": "error",
  "message": "Invalid request.",
  "errors": [
    {
      "title": "Bad Request",
      "detail": "One or more request fields are invalid."
    }
  ]
};
export const docs_example_response_401 = {
  "status": "error",
  "message": "Unauthorized.",
  "errors": [
    {
      "title": "Unauthorized",
      "detail": "Missing or invalid authentication token."
    }
  ]
};
export const docs_example_response_403 = {
  "status": "error",
  "message": "Forbidden.",
  "errors": [
    {
      "title": "Forbidden",
      "detail": "You do not have permission to access this resource."
    }
  ]
};
export const docs_example_response_404 = {
  "status": "error",
  "message": "Event not found.",
  "errors": [
    {
      "title": "Not Found",
      "detail": "No event found for the provided identifier."
    }
  ]
};
export const docs_example_response_500 = {
  "status": "error",
  "message": "Internal server error.",
  "errors": [
    {
      "title": "Internal Server Error",
      "detail": "An unexpected error occurred."
    }
  ]
};
