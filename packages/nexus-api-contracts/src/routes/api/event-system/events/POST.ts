import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.eventSystem.event.insertDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.eventSystem.event.row),
  ...SchemaFactory.Response.standardErrors(),
};
