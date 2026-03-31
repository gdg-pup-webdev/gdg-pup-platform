import { eventRecord } from "#models/v1/eventSystem/event.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(eventRecord
  ),
};

export const docs_summary = "Sync event to Bevy"; 
