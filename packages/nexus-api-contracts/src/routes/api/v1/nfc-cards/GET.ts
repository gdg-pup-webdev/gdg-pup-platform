import { NfcCard, NfcCardInsert } from "#models/v1/nfcCards/nfcCard.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const query = cz.object({
  gdgId: cz.string(),
});

export const response = {
  200: OpenApiSchemas.Response.list(NfcCard),
  ...OpenApiSchemas.Response.standardErrors(),
};
