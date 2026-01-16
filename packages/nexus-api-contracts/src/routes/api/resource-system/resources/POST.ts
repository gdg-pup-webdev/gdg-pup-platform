import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.resourceSystem.resource.insertDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.resourceSystem.resource.row),
  ...SchemaFactory.Response.standardErrors(),
};
