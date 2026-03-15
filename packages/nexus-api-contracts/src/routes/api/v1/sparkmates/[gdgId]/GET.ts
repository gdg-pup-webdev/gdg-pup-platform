import {
  sparkmatesPublicResponse,
  sparkmatesSource,
} from "#models/v1/portfolioSystem/sparkmates.js";
import { OpenApiSchemas, cz as z } from "@packages/typed-rest/shared";

export const query = z.object({
  source: sparkmatesSource.optional(),
});

export const response = {
  200: OpenApiSchemas.Response.single(sparkmatesPublicResponse),
  ...OpenApiSchemas.Response.standardErrors(),
};

export const docs_summary = "Get Sparkmates portfolio by GDG ID";
export const docs_description = [
  "Purpose: Resolve a Sparkmates route (`/sparkmates/{gdgId}`) into card status and public portfolio data.",
  "Inputs: URL param gdgId, optional query source (nfc_card, qr_code, direct_link).",
  "Outputs: Card status and portfolio payload when activated.",
  "Behavior: When card/profile is not activated, portfolio is null.",
  "Errors: 400, 404, 500.",
  "Auth: Public (optional bearer token may be used for owner-aware UX).",
].join("\n\n");
