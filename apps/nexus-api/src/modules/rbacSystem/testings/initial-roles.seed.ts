import { Tables, TablesInsert } from "@/types/supabase.types.js";

export type UserRole = Tables<"user_role">;
export type UserRoleInsert = TablesInsert<"user_role">;
export type UserRolePermission = Tables<"user_role_permission">;
export type UserRolePermissionInsert = TablesInsert<"user_role_permission">;

/**
 * Initial 3 routes for testing
 * focus Events resource only
 */
export const INITIAL_ROLES: UserRoleInsert[] = [
  {
    role_name: "admin",
    description: "Core members with full access to all resources",
  },
  {
    role_name: "moderator",
    description: "Support members who can manage events and moderate content",
  },
  {
    role_name: "member",
    description: "Regular users with basic access",
  },
];

/**
 * Resource name constants
 * Start with one resource for testing
 */
export const RESOURCES = {
  EVENTS: "events",
  /**
   * Future resources (commented for now)
   * ARTICLES: "articles",
   * USERS: "users",
   * COMMENTS: "comments",
   * PROJECTS: "projects",
   * WALLET: "wallet",
   */
} as const;

/**
 * Permission matrix for testing
 * Focus: Events resource only
 */
export const INITIAL_PERMISSION_MATRIX = {
  admin: {
    events: {
      can_read: true,
      can_write: true,
      can_update: true,
      can_delete: true,
    },
  },
  moderator: {
    events: {
      can_read: true,
      can_write: true,
      can_update: true,
      can_delete: false, // only admins can delete events
    },
  },
  member: {
    events: {
      can_read: true,
      can_write: false,
      can_update: false,
      can_delete: false,
    },
  },
} as const;

/**
 * Generate permission inserts from matrix
 */
export function generatePermissionsForRole(
  roleId: string,
  roleName: keyof typeof INITIAL_PERMISSION_MATRIX,
): UserRolePermissionInsert[] {
  const permissions = INITIAL_PERMISSION_MATRIX[roleName];

  return Object.entries(permissions).map(([resourceName, perms]) => ({
    user_role_id: roleId,
    resource_name: resourceName,
    can_read: perms.can_read,
    can_write: perms.can_write,
    can_update: perms.can_update,
    can_delete: perms.can_delete,
  }));
}
