import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.eventSystem.checkin.insertDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.eventSystem.attendance.row),
  ...SchemaFactory.Response.standardErrors(),
};
