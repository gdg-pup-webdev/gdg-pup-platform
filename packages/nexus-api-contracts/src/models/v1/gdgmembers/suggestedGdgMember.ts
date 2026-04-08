import { cz } from "@packages/typed-rest/shared";

// Suggested users expose only a lightweight profile preview for discovery.
export const suggestedGdgMemberRecord = cz.object({
  gdgId: cz.string(),
  displayName: cz.string().nullable(),
  avatarUrl: cz.string().url().nullable(),
  program: cz.string().nullable(),
  department: cz.string().nullable(),
});
