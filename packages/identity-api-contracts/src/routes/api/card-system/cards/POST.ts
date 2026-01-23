import { card } from "#models/cardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(card.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(card.row),
  ...SchemaFactory.Response.standardErrors(),
};
