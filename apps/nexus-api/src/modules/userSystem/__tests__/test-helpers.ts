/**
 * Shared fixtures for userSystem tests.
 */
const now = "2026-01-01T00:00:00.000Z";

export const userFixture = {
  id: "user-1",
  email: "user@example.com",
  display_name: "Test User",
  avatar_url: "https://example.com/avatar.png",
  created_at: now,
  updated_at: now,
  first_name: "Test",
  last_name: "User",
  gdg_id: "gdg-1",
  status: "active",
} as const;

export const walletFixture = {
  id: "wallet-1",
  user_id: userFixture.id,
  balance: 100,
  created_at: now,
  updated_at: now,
} as const;

export const userProfileFixture = {
  id: "profile-1",
  user_id: userFixture.id,
  bio: "Hello",
  created_at: now,
  updated_at: now,
  github_url: "https://github.com/test",
  linkedin_url: "https://linkedin.com/in/test",
  portfolio_url: "https://example.com",
  program: "CS",
  year_level: 4,
  is_public: true,
  skills_summary: "coding",
} as const;

export const userProjectFixture = {
  id: "project-1",
  user_id: userFixture.id,
  title: "GDG Platform",
  description: "Cool project",
  created_at: now,
  repo_url: "https://example.com/repo",
  demo_url: "https://example.com/demo",
  tech_stack: "TS",
} as const;

export const userAchievementFixture = {
  id: "achievement-1",
  user_id: userFixture.id,
  title: "Winner",
  description: "First place",
  image_url: "https://example.com/img",
  achieved_at: now,
  created_at: now,
  updated_at: now,
} as const;

export const userCertificateFixture = {
  id: "certificate-1",
  user_id: userFixture.id,
  title: "Certified",
  description: "Passed",
  image_url: "https://example.com/cert",
} as const;

export const userSettingsFixture = {
  id: "settings-1",
  user_id: userFixture.id,
  color_theme: true,
} as const;

export const userAggregateFixture = {
  ...userFixture,
  wallet: [walletFixture],
  user_profile: [userProfileFixture],
  user_project: [userProjectFixture],
  user_achievement: [userAchievementFixture],
  user_certificate: [userCertificateFixture],
  user_settings: [userSettingsFixture],
} as const;
