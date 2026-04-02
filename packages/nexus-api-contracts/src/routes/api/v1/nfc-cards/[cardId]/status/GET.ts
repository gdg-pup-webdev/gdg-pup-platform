import { NfcCard, NfcCardInsert } from "#models/v1/nfcCards/nfcCard.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";
 
export const response = {
  200: OpenApiSchemas.Response.single(cz.string()),
  ...OpenApiSchemas.Response.standardErrors(),
};
