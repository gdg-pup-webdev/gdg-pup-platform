import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  eventId: "The event ID.",
};
export const docs_summary = "Get an event";
export const docs_description = [
  "Purpose: Retrieve a single event by ID.",
  "Inputs: Path param eventId.",
  "Outputs: Single event object.",
  "Errors: 400, 401, 403, 404, 500.",
  "Auth: Public.",
].join("\\n\\n");
export const docs_response_200 = "Event retrieved successfully.";
export const docs_response_400 = "Invalid event ID.";
