import { NfcAnalyticsRecord } from "#models/v1/analytics/nfcScan.js";
import { cz, OpenApiSchemas } from "@packages/typed-rest/shared";

export const params = cz.object({
  cardId: cz.string().uuid(),
});

export const query = OpenApiSchemas.Request.Query.paginated().extend({
  days: cz.coerce.number().optional().default(7),
});

export const response = {
  200: OpenApiSchemas.Response.single(NfcAnalyticsRecord),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get NFC scan analytics";
export const docs_description =
  "Returns scan analytics and a list of scans for a specific NFC card.";
