import { NfcCard, NfcCardInsert } from "#models/v1/nfcCards/nfcCard.js";
import { OpenApiSchemas } from "@packages/typed-rest/shared";

export const body = OpenApiSchemas.Request.Body.withPayload(NfcCardInsert);

export const response = {
  200: OpenApiSchemas.Response.single(NfcCard),
  ...OpenApiSchemas.Response.standardErrors(),
};
