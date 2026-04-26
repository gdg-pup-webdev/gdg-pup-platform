import { eventRecord } from "#models/v1/eventSystem/event.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const files = {
  image: OpenApiSchemas.Models.file(),
};

export const body = cz.object({});

export const response = {
  200: OpenApiSchemas.Response.single(eventRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Add an image to an event";
export const docs_description =
  "Uploads a new image and appends it to the event image list. The list supports up to 20 images.";
