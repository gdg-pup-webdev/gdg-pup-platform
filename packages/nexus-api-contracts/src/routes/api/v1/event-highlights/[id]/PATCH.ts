import { eventHighlightsRecord, eventHighlightsRecordUpdateDTO } from "#models/v1/eventHighlights/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(eventHighlightsRecordUpdateDTO);

export const response = {
  200: OpenApiSchemas.Response.single(eventHighlightsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Update an event highlight";
export const docs_description = "Updates an existing event highlight record.";
