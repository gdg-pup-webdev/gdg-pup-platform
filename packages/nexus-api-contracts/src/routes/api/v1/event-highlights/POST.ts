import { eventHighlightsRecord, eventHighlightsRecordInsertDTO } from "#models/v1/eventHighlights/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(eventHighlightsRecordInsertDTO);

export const response = {
  201: OpenApiSchemas.Response.single(eventHighlightsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Create an event highlight";
export const docs_description = "Creates a new event highlight record linked to a specific event and author.";
