 
import { SchemaFactory } from "#utils/schemaFactory.utils.js"; 

export const response = {
  200: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};
