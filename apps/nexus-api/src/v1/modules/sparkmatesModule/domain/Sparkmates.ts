export type SparkmatesSource = "nfc_card" | "qr_code" | "direct_link";

export type SparkmatesCardStatus =
  | "issued"
  | "activated"
  | "suspended"
  | "revoked";

export type SparkmatesCardState = {
  gdgId: string;
  status: SparkmatesCardStatus;
  isPublic: boolean;
};

export type SparkmatesCardRegistration = {
  gdgId: string;
  ownerUserId: string | null;
  status: SparkmatesCardStatus;
};

export type SparkmatesCardRegistrationFailure = {
  gdgId: string;
  error: string;
};

export type SparkmatesBulkRegistrationResult = {
  registered: SparkmatesCardRegistration[];
  failed: SparkmatesCardRegistrationFailure[];
};

export type SparkmatesPublicPortfolio = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  fullName: string | null;
  nickname: string | null;
  gdgId: string | null;
  membershipType: string | null;
  department: string | null;
  yearAndProgram: string | null;
  bio: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioWebsiteUrl: string | null;
  otherLinks: string[];
  technicalSkills: string[];
  learningInterests: string[];
  toolsAndTechnologies: string[];
  isPublic: boolean;
};

export type SparkmatesPublicRecord = {
  gdgId: string;
  source: SparkmatesSource;
  status: SparkmatesCardStatus;
  portfolio: SparkmatesPublicPortfolio | null;
};
