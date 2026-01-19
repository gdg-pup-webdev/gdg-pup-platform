import { attendance, checkin } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(checkin.insertDTO);

export const response = {
  200: SchemaFactory.Response.single(attendance.row),
  ...SchemaFactory.Response.standardErrors(),
};
