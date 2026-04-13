import { eventRecord } from "#models/v1/eventSystem/event.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(
  cz.object({
    fromIndex: cz.number().int().nonnegative(),
    toIndex: cz.number().int().nonnegative(),
  }),
);

export const response = {
  200: OpenApiSchemas.Response.single(eventRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Reorder event images";
export const docs_description =
  "Moves an image from fromIndex to toIndex within the event image list.";
