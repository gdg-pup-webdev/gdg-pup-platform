
import { cz } from "@packages/typed-rest/shared";

import { eventRecordUpdateDTO } from "#models/v1/eventSystem/event.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  thumbnail: OpenApiSchemas.Models.file(),
};

export const body = OpenApiSchemas.Request.Body.withPayload(eventRecordUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(eventRecordUpdateDTO),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an event";
export const docs_description = [
  "Purpose: Update an existing event's details.",
  "Inputs: Path: eventId. Body: Partial event data. Files: Optional thumbnail image.",
  "Outputs: Updated event object.",
].join("\n\n");

