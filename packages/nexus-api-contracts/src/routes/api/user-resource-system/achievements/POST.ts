import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(achievement.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};