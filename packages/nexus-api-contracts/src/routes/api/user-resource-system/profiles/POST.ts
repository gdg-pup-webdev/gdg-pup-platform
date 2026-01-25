import { profile } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(profile.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(profile.row),
  ...SchemaFactory.Response.standardErrors(),
};