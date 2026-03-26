import { cz } from "@packages/typed-rest/shared";

export const NfcCard = cz.object({
  id: cz.string(),
  ownerGdgId: cz.string(),
  status: cz.string(),
  notes: cz.string().nullable(),
  destinationUrl: cz.string().nullable(),
  activated_at: cz.string().nullable(),
  suspended_at: cz.string().nullable(),
  revoked_at: cz.string().nullable(),
});

export const NfcCardInsert = cz.object({
  ownerGdgId: cz.string(),
  notes: cz.string().nullable(),
});
