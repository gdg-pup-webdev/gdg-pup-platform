import { ScrapedGdgEventsObject } from "#models/v1/bevyEvents/scrapedGdgEvents.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = OpenApiSchemas.Request.Query.paginated();

export const response = {
  200: OpenApiSchemas.Response.paginated(ScrapedGdgEventsObject),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "List all GDG events from Bevy";
export const docs_description = "List all GDG events from Bevy";
