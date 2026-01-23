 import { SchemaFactory } from "#utils/schemaFactory.utils.js";
 import { card } from "#models/cardSystem/index.js";


export const response = {
  200: SchemaFactory.Response.single(card.cardStatus),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  cardUid: "The unique identifier of the NFC card",
}

export const docs_description = "Get card status by UID";
export const docs_summary = "Get card status by UID";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";