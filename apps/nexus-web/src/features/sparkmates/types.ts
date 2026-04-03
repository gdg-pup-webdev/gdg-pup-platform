import { contract } from "@packages/nexus-api-contracts";


export type UserProfile = contract.api.v1.gdgmembers.gdgId.GET.response[200]["data"]; 




export type SparkmatesStatus = "issued" | "activated" | "suspended" | "revoked";

export type SparkmatesSource = "nfc_card" | "qr_code" | "direct_link";

/**
 * @deprecated 
 */
export type SparkmatesProfile = UserProfile

export type SuggestedSparkmate = {
  gdgId: string;
  name: string;
  programYear: string;
  bio: string;
  avatarUrl: string | null;
  skills: string[];
  interests: string[];
};

/**
 * @deprecated
 */
export type SparkmatesPortfolio = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  full_name: string | null;
  nickname: string | null;
  gdg_id: string | null;
  membership_type: string | null;
  department: string | null;
  year_and_program: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_website_url: string | null;
  other_links: string[];
  technical_skills: string[];
  learning_interests: string[];
  tools_and_technologies: string[];
  is_public: boolean;
};

/**
 * @deprecated
 */
export type SparkmateProfile = {
  gdg_id: string;
  owner_user_id: string;
  source: SparkmatesSource;
  status: SparkmatesStatus;
  portfolio: SparkmatesPortfolio | null;
};

/**
 * @deprecated
 */
export type SparkmateApiSuccess<TData> = {
  status: "success";
  message: string;
  data: TData;
};

/**
 * @deprecated
 */
export type SparkmateApiError = {
  status: "error";
  message: string;
};
