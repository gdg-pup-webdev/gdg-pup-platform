/**
 * Shared fixtures for teamsSystem tests.
 */
export const teamsPagination = {
  pageNumber: 1,
  pageSize: 10,
} as const;

export const teamFixture = {
  id: "team-1",
  name: "Core Team",
  description: "Maintainers and leads",
} as const;

export const memberFixture = {
  id: "member-1",
  team_id: teamFixture.id,
  user_id: "user-1",
  role: "lead",
} as const;

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
