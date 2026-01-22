import { row, update } from "#models/teamSystem/team.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(update);

export const response = {
  200: SchemaFactory.Response.single(row),
  ...SchemaFactory.Response.standardErrors(),
};
