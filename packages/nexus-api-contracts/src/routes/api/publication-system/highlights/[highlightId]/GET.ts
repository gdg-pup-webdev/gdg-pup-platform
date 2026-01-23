import { highlight } from "#models/publicationSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.single(highlight.row),
  ...SchemaFactory.Response.standardErrors(),
};
