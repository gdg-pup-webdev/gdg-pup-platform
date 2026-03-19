import { eventHighlightsRecord } from "#models/v1/eventHighlights/record.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(eventHighlightsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get an event highlight";
export const docs_description = "Returns a single event highlight record by its ID.";
