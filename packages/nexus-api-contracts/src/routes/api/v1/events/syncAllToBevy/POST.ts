import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(
    cz.object({
      success: cz.number(),
      fail: cz.number(),
      failMessages: cz.array(
        cz.object({
          id: cz.string(),
          error: cz.string(),
        }),
      ),
    }),
  ),
};

export const docs_summary = "Sync all events from Bevy";
