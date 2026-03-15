import { cz } from "@packages/typed-rest/shared";
import { portfolioRow } from "./portfolio";

export const sparkmatesSource = cz.union([
  cz.literal("nfc_card"),
  cz.literal("qr_code"),
  cz.literal("direct_link"),
]);

export const sparkmatesCardStatus = cz.union([
  cz.literal("issued"),
  cz.literal("activated"),
  cz.literal("suspended"),
  cz.literal("revoked"),
]);

export const sparkmatesPublicResponse = cz.object({
  gdg_id: cz.string(),
  owner_user_id: cz.string().uuid(),
  source: sparkmatesSource,
  status: sparkmatesCardStatus,
  portfolio: portfolioRow.nullable(),
});

export const sparkmatesCardStatusResponse = cz.object({
  gdg_id: cz.string(),
  owner_user_id: cz.string().uuid(),
  status: sparkmatesCardStatus,
  is_public: cz.boolean(),
});

export const sparkmatesCardActivateResponse = cz.object({
  gdg_id: cz.string(),
  owner_user_id: cz.string().uuid(),
  status: cz.literal("activated"),
  is_public: cz.literal(true),
});

export const nfcCardRegisterPayload = cz.object({
  gdg_id: cz.string(),
  owner_user_id: cz.string().uuid().nullable().optional(),
  notes: cz.string().nullable().optional(),
});

export const nfcCardRegisterBulkPayload = cz.object({
  cards: cz.array(nfcCardRegisterPayload).min(1),
});

export const nfcCardRegisterResponse = cz.object({
  gdg_id: cz.string(),
  owner_user_id: cz.string().uuid().nullable(),
  status: sparkmatesCardStatus,
});

export const nfcCardRegisterBulkFailure = cz.object({
  gdg_id: cz.string(),
  error: cz.string(),
});

export const nfcCardRegisterBulkResponse = cz.object({
  registered: cz.array(nfcCardRegisterResponse),
  failed: cz.array(nfcCardRegisterBulkFailure),
});
