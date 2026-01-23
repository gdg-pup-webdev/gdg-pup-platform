import { article } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(article.update);

export const response = {
  200: SchemaFactory.Response.single(article.row),
  ...SchemaFactory.Response.standardErrors(),
};
