import { Tables } from "../../../types/supabase.types";

type userRolePermission = Tables<"user_role_permission">;

/**
 * Shared fixtures and helpers for RBAC role tests.
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

export const userFixture = {
  id: "user-1",
  email: "user1@example.com",
  display_name: "User One",
  gdg_id: "GDG-001",
  status: "active",
} as const;

export const roleJunctionFixture = {
  user_id: "user-1",
  role_id: "role-1",
} as const;

export const permissionFixture: userRolePermission = { 
  role_id: "role-1",
  resource: "resource-1",
  action: "action-1",

};

export const listResult = <T>(items: T[] = []) => ({
  list: items,
  count: items.length,
});

export const singleResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
