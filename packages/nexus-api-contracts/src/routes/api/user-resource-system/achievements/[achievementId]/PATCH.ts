import { achievement } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(achievement.updateDTO);

export const response = {
  200: SchemaFactory.Response.single(achievement.row),
  ...SchemaFactory.Response.standardErrors(),
};
