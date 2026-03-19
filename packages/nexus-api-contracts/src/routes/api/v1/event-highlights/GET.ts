import { eventHighlightsRecord } from "#models/v1/eventHighlights/record.js";
import { OpenApiSchemas, cz } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  eventId: cz.string().uuid().optional(),
});

export const response = {
  200: OpenApiSchemas.Response.paginated(eventHighlightsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List event highlights";
export const docs_description = "Returns a paginated list of event highlights, optionally filtered by event ID.";
