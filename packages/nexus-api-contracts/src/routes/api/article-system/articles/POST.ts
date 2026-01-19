import { article } from "#models/articleSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(
  article.insertDTO
);

export const response = {
  200: SchemaFactory.Response.single( article.row),
  ...SchemaFactory.Response.standardErrors(),
};
