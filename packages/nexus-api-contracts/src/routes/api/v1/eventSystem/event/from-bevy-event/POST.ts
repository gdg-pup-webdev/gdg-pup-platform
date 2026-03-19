import { cz, OpenApiSchemas } from "@packages/typed-rest/shared"; 
import { eventRecord } from "#models/v1/eventSystem/event.js"

export const body = cz.object({
    bevy_event_id: cz.string(),
});

export const response = {
  201: OpenApiSchemas.Response.single(eventRecord),
};

export const docs_summary = "Create Event From Bevy Event";
export const docs_description = "Creates a new event from an existing Bevy event.";
