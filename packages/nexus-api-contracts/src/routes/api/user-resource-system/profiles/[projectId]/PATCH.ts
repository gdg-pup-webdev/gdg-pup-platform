import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.userResourceSystem.project.updateDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.userResourceSystem.project.row),
  ...SchemaFactory.Response.standardErrors(),
};
