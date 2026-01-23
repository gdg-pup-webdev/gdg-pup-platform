 import { SchemaFactory } from "#utils/schemaFactory.utils.js";


export const response = {
  201: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};
