import { ScrapedGdgEventsObject } from "#models/v1/bevyEvents/scrapedGdgEvents.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(ScrapedGdgEventsObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get a GDG event from Bevy";
export const docs_description = "Get a GDG event from Bevy by its GDG ID";
