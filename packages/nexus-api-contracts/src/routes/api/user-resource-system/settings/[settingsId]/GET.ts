import { settings } from "#models/userResourceSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single(settings.row),
  ...SchemaFactory.Response.standardErrors(),
};