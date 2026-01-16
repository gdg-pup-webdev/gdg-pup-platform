import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  Models.articleSystem.article.insertDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.articleSystem.article.row),
  ...SchemaFactory.Response.standardErrors(),
};
