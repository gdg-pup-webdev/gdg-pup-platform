import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(settings.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};