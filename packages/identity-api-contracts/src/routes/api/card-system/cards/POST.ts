import { card } from "#models/cardSystem/index.js";
import { SchemaFactory } from "#utils/schemaFactory.utils.js";

export const body = SchemaFactory.Request.withPayload(card.insertDTO);

export const response = {
  201: SchemaFactory.Response.single(card.row),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_body = "New card data";

export const docs_description = "Create a new NFC card. ";

export const docs_summary = "Create a new NFC card";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
