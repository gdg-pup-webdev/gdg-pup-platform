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
  userRoleJunctionType,
} from "./role.types";
import { userRow } from "@/modules/userSystem/users/user.types";

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

    // Check if we are filtering by permission attributes
    const needsPermissionInner = !!(filters.resource || filters.action);
    const permissionSelect = needsPermissionInner
      ? "user_role_permission!inner(*)"
      : "user_role_permission(*)";

    const junctionSelect = filters.userId
      ? "user_role_junction!inner(*)"
      : "user_role_junction(*)";

    let query = supabase
      .from(this.roleTable)
      .select(`*, ${permissionSelect}, ${junctionSelect}`, {
        count: "exact",
      });

    // These filters now correctly "prune" the parent list because of !inner
    if (filters.resource) {
      query = query.eq("user_role_permission.resource", filters.resource);
    }

    if (filters.action) {
      query = query.eq("user_role_permission.action", filters.action);
    }

    if (filters.userId) {
      query = query.eq("user_role_junction.user_id", filters.userId);
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
    const insertObject = roleIds.flatMap((roleId) =>
      userIds.map((userId) => ({ user_id: userId, role_id: roleId })),
    );
    const { error } = await supabase
      .from(this.junctionTable)
      .insert(insertObject);

    if (error) console.log("assign roles to users error");
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
      .from("user_role")
      .select("*, user_role_permission(*)")
      .in("id", roleIds);

    if (updatedRolesError) handlePostgresError(updatedRolesError);

    return updatedRoles as rolePermissionRow[];
  };

  /**
   * delete a role
   */
  deleteOneRole = async (roleId: string) => {
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
  updateOneRole = async (roleId: string, dto: roleUpdate) => {
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
        .in("role_id", roleIds);

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
   * List users that is assigned a specific role
   */
  listUsersThatHasRole = async (
    pageNumber: number,
    pageSize: number,
    roleId: string,
  ) => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Handle users WITH roles (optionally filtered by roleId)
    let query = supabase
      .from(this.junctionTable)
      .select(`*, user(*)`, {
        count: "exact",
      })
      .eq("role_id", roleId);

    const { data, error, count } = await query
      .range(from, to)
      .overrideTypes<Array<userRoleJunctionType & { user: userRow }>>();

    if (error) handlePostgresError(error);

    // Group roles by user
    const users = data.map((u) => u.user);

    return {
      list: users,
      count: count || 0,
    };
  };

  //////////////////////////////////////
  //
  // DEPRECATED METHODS
  // - keep deprecated methods for backwards compatibility
  //
  //////////////////////////////////////

  /**
   * @deprecated use assignRolesToUsers
   */
  assignRole = async (userId: string, roleId: string) => {
    const { data, error } = await supabase.from(this.junctionTable).insert({
      user_id: userId,
      role_id: roleId,
    });

    if (error) handlePostgresError(error);
  };

  /**
   * @deprecated use unassignRolesFromUsers
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

    if (error) handlePostgresError(error);

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
