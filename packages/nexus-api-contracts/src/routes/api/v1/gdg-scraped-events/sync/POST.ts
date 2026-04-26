import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(
    cz.object({
      syncedCount: cz.number(),
    })
  ),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Sync GDG events from Bevy API";
export const docs_description = "Fetches latest events from GDG PUP chapter on community.dev and updates the local database.";
