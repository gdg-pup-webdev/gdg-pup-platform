export const EXTERNAL_LINKS = {
  LIVE_WEBSITE: "https://gdgpup.org/",
} as const;

export const INTERNAL_LINKS = {
  ARTICLES: "/admin/articles",
  MEMBER_PROJECTS: "/admin/member-projects",
  HOME: "/",
  DASHBOARD: "/admin",
  DEBUG_PAGE: "/admin/debug",
  TEAMS: "/admin/teams",
  FILES: "/admin/files", 
  LEARNING_RESOURCES: "/admin/learning-resources",
  EVENTS: "/admin/events",
  EVENT_HIGHLIGHTS: "/admin/event-highlights",
  BEVY_EVENTS: "/admin/bevy-events",
  PORTFOLIOS: "/admin/portfolios",
  PROFILE: "/admin/profile",
  LOGIN: "/authentication/login",
  MEMBERS: "/admin/members",
  MEMBER_SHOWCASE: "/admin/member-showcase",
  RBAC: "/admin/roles-and-permissions",
} as const;


export const LINKS = {
  landing: "/",
  auth_signin: "/signin",
  auth_signup: "/signup",
  auth_forgot_password: "/forgot-password",

  profile_me: "/me",

  debugging: {
    landing: "/",
    "auth debug": "/debugging/authentication",
    login: "/signin",
    signup: "/signup",
    testSparkmateProfile: "/sparkmates/GDGPUP-26-000033",
    testSelfProfile: "/me",
    testNfcCards: "/me/nfc-cards",
    testNfcCard: "/nfc-cards/c2476a15-14bd-4574-8aba-d1b5845872cf",
  },
};
