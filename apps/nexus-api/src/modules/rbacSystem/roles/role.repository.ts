import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
  BadRequestError,
} from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResultList,
  RepositoryResult,
} from "@/types/repository.types.js";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { handlePostgresError } from "@/lib/supabase.utils";
import {
  roleWithPermission,
  roleFilters,
  roleInsert,
  rolePermissionInsert,
  rolePermissionRow,
  roleRow,
  roleUpdate,
  roleWithPermissionAndUser,
} from "./role.types";

/**
 * RoleRepository
 * ---------------
 * Repository for accessing and managing role data in the database.
 * Handles direct interactions with role-related tables.
 *
 * All methods throw custom errors for known failure cases.
 */
export class RoleRepository {
  roleTable = "user_role"; // Stores created roles
  junctionTable = "user_role_junction"; // Relationship between user and role
  userTable = "user"; // User table

  constructor() {}

  /**
   * List roles including its permissions and users
   * filters:
   * - userId - id of user the role is assigned to
   * - resource - name of the resource the role has permission to
   * - action - roles with specific action towards a resource
   */
  listRoles = async (
    pageNumber: number,
    pageSize: number,
    filters: roleFilters,
  ) => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.roleTable)
      .select(`*, user_role_permission(*), user_role_junction(*)`, {
        count: "exact",
      });

    if (filters.userId) {
      query = query.eq("user_role_junction.user_id", filters.userId);
    }

    if (filters.resource) {
      query = query.eq("user_role_permission.resource", filters.resource);
    }

    if (filters.action) {
      query = query.eq("user_role_permission.action", filters.action);
    }

    if (filters.roleId) {
      query = query.eq("id", filters.roleId);
    }

    query = query.range(from, to);

    const { data, error, count } =
      await query.overrideTypes<roleWithPermissionAndUser[]>();

    if (error) handlePostgresError(error);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Creates a new role.
   */
  createRoles = async (roleList: roleInsert[]) => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .insert(roleList)
      .select("*")
      .single<roleRow[]>();

    if (error) handlePostgresError(error);

    return data;
  };

  /**
   * assigns a list of roles to a list of users
   */
  assignRolesToUsers = async (roleIds: string[], userIds: string[]) => {
    const { error } = await supabase
      .from(this.junctionTable)
      .insert(
        roleIds.map((roleId) =>
          userIds.map((userId) => ({ user_id: userId, role_id: roleId })),
        ),
      );

    if (error) handlePostgresError(error);
  };

  /**
   * attach a list of permissions to a list of roles
   */
  attachPermissionsToRoles = async (
    roleIds: string[],
    permissions: { resource: string; action: string }[],
  ) => {
    const rowsToInsert = roleIds.flatMap((roleId) =>
      permissions.map((p) => ({
        role_id: roleId,
        resource: p.resource,
        action: p.action,
      })),
    );

    const { error } = await supabase
      .from("user_role_permission")
      .insert(rowsToInsert);

    if (error) handlePostgresError(error);

    const { data: updatedRoles, error: updatedRolesError } = await supabase
      .from("user_roles")
      .select("*, user_role_permission(*)")
      .in("id", roleIds);

    if (updatedRolesError) handlePostgresError(updatedRolesError);

    return updatedRoles as rolePermissionRow[];
  };

  /**
   * delete a role
   */
  deleteRole = async (roleId: string) => {
    const { data: existingRole, error: existingRoleError } = await supabase
      .from(this.roleTable)
      .select("*")
      .eq("id", roleId)
      .single();

    if (existingRoleError) handlePostgresError(existingRoleError);

    if (!existingRole) {
      throw new NotFoundError("Role not found");
    }

    if (existingRole.name === "admin" || existingRole.name === "default") {
      throw new ForbiddenError("Cannot delete default admin roles");
    }

    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", roleId);

    if (error) handlePostgresError(error);
  };

  /**
   * Updates an existing role.
   */
  updateRole = async (roleId: string, dto: roleUpdate) => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .update(dto)
      .eq("id", roleId)
      .select("*")
      .single<roleRow>();

    if (error) handlePostgresError(error);

    return data;
  };

  detachPermissionsFromRoles = async (
    roleIds: string[],
    permissions: { resource: string; action: string }[],
  ) => {
    const { error } = await supabase
      .from("user_role_permission")
      .delete()
      .in("role_id", roleIds)
      .in(
        "resource",
        permissions.map((p) => p.resource),
      )
      .in(
        "action",
        permissions.map((p) => p.action),
      );

    if (error) handlePostgresError(error);

    const { data: updatedPermissions, error: updatedPermissionsError } =
      await supabase
        .from("user_role_permission")
        .select("*")
        .in("role_id", roleIds) 

    if (updatedPermissionsError) handlePostgresError(updatedPermissionsError);

    return updatedPermissions as rolePermissionRow[];
  };

  /**
   * Unassigns a list of roles from a list of users
   */
  unassignRolesFromUsers = async (roleIds: string[], userIds: string[]) => {
    const { error } = await supabase
      .from(this.junctionTable)
      .delete()
      .in("role_id", roleIds)
      .in("user_id", userIds);

    if (error) handlePostgresError(error);
  };

  /**
   * get role id by name
   */
  getRoleIdByName = async (roleName: string) => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select("id")
      .eq("name", roleName)
      .single();

    if (error) handlePostgresError(error);

    return data?.id;
  };

  /**
   * Fetches a paginated list of users and their assigned roles.
   * Can optionally filter by specific role or show users without roles.
   *
   * @param pageNumber - Current page number (1-indexed)
   * @param pageSize - Number of items per page
   * @param filters - Optional filters (roleId, withoutRoles)
   * @returns A promise resolving to grouped user-role data and count
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  listUsersWithRoles = async (
    pageNumber: number,
    pageSize: number,
    filters?: {
      roleId?: string;
      withoutRoles?: boolean;
    },
  ): RepositoryResultList<{ user: userRow; roles: roleRow[] }> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Handle users WITHOUT roles
    if (filters?.withoutRoles) {
      const { data: allUsers, error: usersError } = await supabase
        .from(this.userTable)
        .select("*")
        .range(from, to);

      if (usersError) throw new DatabaseError_DONT_USE(usersError.message);

      const { data: usersWithRoles, error: rolesError } = await supabase
        .from(this.junctionTable)
        .select("user_id");

      if (rolesError) throw new DatabaseError_DONT_USE(rolesError.message);

      const userIdsWithRoles = new Set(
        usersWithRoles.map((row) => row.user_id),
      );
      const usersWithoutRoles = allUsers.filter(
        (user) => !userIdsWithRoles.has(user.id),
      );

      const { count, error: countError } = await supabase
        .from(this.userTable)
        .select("*", { count: "exact", head: true });

      if (countError) throw new DatabaseError_DONT_USE(countError.message);

      const totalUsersWithoutRoles = (count || 0) - userIdsWithRoles.size;

      return {
        list: usersWithoutRoles.map((user) => ({ user, roles: [] })),
        count: totalUsersWithoutRoles,
      };
    }

    // Handle users WITH roles (optionally filtered by roleId)
    let query = supabase.from(this.junctionTable).select(
      `
      user:user_id(*),
      user_role (*, user_role_permission(*))
    `,
      { count: "exact" },
    );

    if (filters?.roleId) {
      query = query.eq("role_id", filters.roleId);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) throw new DatabaseError_DONT_USE(error.message);

    // Group roles by user
    const userMap: Record<string, { user: userRow; roles: roleRow[] }> = {};

    for (const row of data as any[]) {
      const user = row.user;
      const role = row.user_role;
      if (!user || !role) continue;

      if (!userMap[user.id]) {
        userMap[user.id] = { user, roles: [] };
      }
      userMap[user.id].roles.push(role);
    }

    return {
      list: Object.values(userMap),
      count: count || 0,
    };
  };

  // =========================================================================================== //

  /**
   * Assigns a role to a user.
   *
   * @param userId - The ID of the user
   * @param roleId - The ID of the role
   * @returns A promise resolving to the created junction row
   * @throws {NotFoundError} If user or role does not exist
   * @throws {RepositoryError_DEPRECATED} If already assigned
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  assignRole = async (
    userId: string,
    roleId: string,
  ): RepositoryResult<userRoleJunctionRow> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) {
      // Foreign key violation: user or role not found
      if (error.code === "23503") {
        throw new NotFoundError("User or role not found");
      }

      // Unique constraint violation: user already has this role
      if (error.code === "23505") {
        throw new ConflictError("User already has this role assigned");
      }

      throw new DatabaseError_DONT_USE(error.message);
    }

    if (!data) {
      throw new DatabaseError_DONT_USE(
        "Failed to assign role - no data returned",
      );
    }

    return data;
  };

  /**
   * Removes a role from a user.
   *
   * @param userId - The ID of the user
   * @param roleId - The ID of the role
   * @returns A promise resolving to success status
   * @throws {NotFoundError} If the user-role assignment does not exist
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  removeRole = async (
    userId: string,
    roleId: string,
  ): RepositoryResult<void> => {
    const { error, count } = await supabase
      .from(this.junctionTable)
      .delete({ count: "exact" })
      .eq("user_id", userId)
      .eq("role_id", roleId);

    if (error) throw new DatabaseError_DONT_USE(error.message);

    if (count === 0) {
      throw new NotFoundError(
        "User-role assignment not found. The user may not have this role assigned.",
      );
    }

    return;
  };
}

/**
 * Singleton instance of the RoleRepository for use throughout the app.
 */
export const roleRepositoryInstance = new RoleRepository();
