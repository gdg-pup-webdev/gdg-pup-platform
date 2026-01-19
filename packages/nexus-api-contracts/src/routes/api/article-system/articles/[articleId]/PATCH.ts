import { article } from "#models/articleSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const body = SchemaFactory.Request.withPayload(
   article.updateDTO
);

export const response = {
  200: SchemaFactory.Response.single( article.row),
  ...SchemaFactory.Response.standardErrors(),
};
