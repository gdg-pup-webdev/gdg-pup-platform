import { SchemaFactory } from "#utils/schemaFactory.utils.js";
import { card } from "#models/cardSystem/index.js";

export const body = SchemaFactory.Request.withPayload(card.activateCardDTO);

export const response = {
  201: SchemaFactory.Response.empty(),
  ...SchemaFactory.Response.standardErrors(),
};

export const docs_params = {
  cardUid: "The unique identifier of the NFC card (from the tap/redirect URL)",
};

export const docs_description =
  "Activate an NFC card for the authenticated user. This endpoint is called by the frontend after the user taps their NFC card (which opens the encoded URL) or scans a corresponding QR code. The frontend handles the redirect logic, authenticates the user, and then calls this endpoint with the cardUid from the URL.";
export const docs_summary = "Activate an NFC card";
export const docs_response_200 = "Success";
export const docs_response_400 = "Bad request";
