import { contract } from "@packages/nexus-api-contracts";

export type SparkmatesStatus = "issued" | "activated" | "suspended" | "revoked";

export type SparkmatesSource = "nfc_card" | "qr_code" | "direct_link";

export type SparkmatesProfile = contract.api.v1.sparkmates.gdgId.GET.response[200]["data"] 
 
export type SuggestedSparkmate = {
  gdgId: string;
  name: string;
  programYear: string;
  bio: string;
  avatarUrl: string | null;
  skills: string[];
  interests: string[];
};
