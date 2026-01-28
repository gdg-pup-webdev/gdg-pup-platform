/**
 * Shared fixtures for RBAC role tests.
 */
export const rbacPagination = {
  pageNumber: 1,
  pageSize: 10,
} as const;

export const roleFixture = {
  id: "role-1",
  role_name: "admin",
  description: "Administrator role",
} as const;

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
