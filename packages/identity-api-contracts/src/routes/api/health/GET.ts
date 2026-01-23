
import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 
export const response = {
  200: SchemaFactory.Response.empty(),
  500: SchemaFactory.Response.error(),
};


export const docs_description =
  "Health check";
export const docs_summary = "Health check";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
