 import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 import { card } from "#models/cardSystem/index.js";


export const response = {
  200: SchemaFactory.Response.single(card.cardStatus),
  ...SchemaFactory.Response.standardErrors(),
};
