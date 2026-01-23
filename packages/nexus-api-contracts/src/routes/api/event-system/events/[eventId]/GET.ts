import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(event.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  eventId: "the event id",
}
export const docs_summary = "Get an event";
export const docs_description = "Get an event"; 
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request"; 