import { eventRecord } from "#models/v1/eventSystem/event.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const response = {
  200: OpenApiSchemas.Response.single(eventRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Delete an event image by index";
export const docs_description =
  "Deletes an image at the given index and compacts the remaining image order.";
