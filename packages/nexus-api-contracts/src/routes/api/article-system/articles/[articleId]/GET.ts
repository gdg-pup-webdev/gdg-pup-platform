import { Models } from "#models/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import z from "zod";
 
export const response = {
  200: SchemaFactory.Response.single(Models.articleSystem.article.row),
  ...SchemaFactory.Response.standardErrors(),
};
