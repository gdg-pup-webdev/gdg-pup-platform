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
  // Core Identifiers
  gdgId: string;
  email: string;

  /**
   * membership
   */

  membershipType: string | null;

  /**
   * profile
   */
  avatarUrl: string | null;

  // education
  program: string | null;
  yearLevel: number | null;
  department: string | null;

  // name
  displayName: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;

  /**
   * portfolio
   */
  // Bio
  bio: string | null;

  // Socials
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioWebsiteUrl: string | null;
  otherLinks: string[];

  // Skills & Interests
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
