 import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { card } from "#models/cardSystem/index.js";

export const body = SchemaFactory.Request.withPayload(card.activateCardDTO);

export const response = {
  201: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};
