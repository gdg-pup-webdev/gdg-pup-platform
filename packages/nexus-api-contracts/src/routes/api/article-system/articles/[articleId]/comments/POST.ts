import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.articleSystem.comment.insertDTO
);

export const response = {
  201: SchemaFactory.Response.single(Models.articleSystem.comment.row),
  ...SchemaFactory.Response.standardErrors(),
};
