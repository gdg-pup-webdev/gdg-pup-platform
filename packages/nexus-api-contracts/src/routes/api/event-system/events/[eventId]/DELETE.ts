 import { event } from "#models/eventSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const response = {
  200: SchemaFactory.Response.single( event.row),
  ...SchemaFactory.Response.standardErrors(),
};
