import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";

export const body = SchemaFactory.Request.withPayload(
  Models.articleSystem.article.updateDTO
);

export const response = {
  200: SchemaFactory.Response.single(Models.articleSystem.article.row),
  ...SchemaFactory.Response.standardErrors(),
};
