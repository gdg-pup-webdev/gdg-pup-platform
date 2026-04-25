import { gdgMemberRecord } from "./gdgMember";

// Suggested users expose only a lightweight profile preview for discovery.
export const suggestedGdgMemberRecord = gdgMemberRecord.omit({
  email: true,
  bio: true,
  githubUrl: true,
  linkedinUrl: true,
  portfolioWebsiteUrl: true,
  otherLinks: true,
  sectionOrder: true,
  isOnboarded: true,
});
