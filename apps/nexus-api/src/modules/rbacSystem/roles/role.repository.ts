import { NotFoundError, ConflictError } from "@/errors/HttpError";
import {
  RepositoryError_DEPRECATED,
  InvalidOperationError_DEPRECATED,
} from "@/classes/ServerError";
import { DatabaseError_DONT_USE } from "@/errors/HttpError";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResultList,
  RepositoryResult,
} from "@/types/repository.types.js";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types.js";
import { handlePostgresError } from "@/lib/supabase.utils";
import {
  roleAggregate,
  roleFilters,
  roleInsert,
  rolePermissionInsert,
  rolePermissionRow,
  roleRow,
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
   * Lists roles based on provided filters.
   * If userId is provided, returns roles for that user.
   * Otherwise, returns all roles.
   *
   * @param pageNumber - Current page number (1-indexed)
   * @param pageSize - Number of items per page
   * @param filters - Object containing optional userId filter
   * @returns A promise resolving to a list of roles and total count
   */
  listRolesWithFilters = async (
    pageNumber: number,
    pageSize: number,
    filters: roleFilters,
  ) => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from(this.roleTable)
      .select(`*, user_role_permission(*)`, { count: "exact" });

    if (filters.userId) {
      // Assuming 'id' is the column on the Role table
      query = query.eq("id", filters.userId);
    }

    if (filters.resource) {
      query = query.eq("user_role_permission.resource", filters.resource);
    }

    if (filters.action) {
      query = query.eq("user_role_permission.action", filters.action);
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) handlePostgresError(error);

    return {
      list: data as roleAggregate[],
      count: count || 0,
    };
  };

  /**
   * Creates a new role.
   *
   * @param roleData - The role data to insert
   * @returns A promise resolving to the created role
   * @throws {RepositoryError_DEPRECATED} If a role with the same name already exists
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  create = async (dto: roleInsert): Promise<roleAggregate> => {
    const { error } = await supabase.from(this.roleTable).insert(dto);

    if (error) handlePostgresError(error);

    return {
      ...dto,
      user_role_permission: [],
    };
  };

  assignRolesToUser = async (userId: string, roleNames: string[]) => {
    const { error } = await supabase
      .from(this.junctionTable)
      .insert(
        roleNames.map((roleName) => ({ user_id: userId, role_name: roleName })),
      );

    if (error) handlePostgresError(error);
  };

  attachPermissions = async (
    roleName: string,
    permissions: rolePermissionInsert[],
  ) => {
    console.log("hell oworld" , roleName, permissions)

    const permissionsDTO = permissions.map((permission) => ({
      role: roleName,
      resource: permission.resource,
      action: permission.action,
    }));

    const { error } = await supabase
      .from("user_role_permission")
      .insert(permissionsDTO);

    if (error) handlePostgresError(error);

    const { data, error: checkError } = await supabase
      .from("user_role_permission")
      .select("*")
      .eq("role", roleName);

    if (checkError) handlePostgresError(checkError);

    return data as rolePermissionRow[];
  };

  /**
   * Fetches a single role by its ID.
   *
   * @param roleId - The ID of the role
   * @returns A promise resolving to the role data
   * @throws {NotFoundError} If role is not found
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  getRole = async (roleId: string): RepositoryResult<roleRow> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission (*)`)
      .eq("id", roleId)
      .maybeSingle();

    if (error) throw new DatabaseError_DONT_USE(error.message);

    if (!data) throw new NotFoundError(`Role with ID "${roleId}" not found`);

    return data;
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
   * Updates an existing role.
   *
   * @param roleId - The ID of the role to update
   * @param updates - Partial role data to update
   * @returns A promise resolving to the updated role
   * @throws {NotFoundError} If the role does not exist
   * @throws {RepositoryError_DEPRECATED} If updating to a duplicate role name
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  update = async (
    roleId: string,
    updates: Partial<TablesUpdate<"user_role">>,
  ): RepositoryResult<roleRow> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .update(updates)
      .eq("id", roleId)
      .select()
      .single();

    if (error) {
      // Not found error code from Supabase/PostgREST
      if (error.code === "PGRST116") {
        throw new NotFoundError(`Role with ID "${roleId}" not found`);
      }

      // Unique constraint violation (duplicate role name)
      if (error.code === "23505") {
        throw new ConflictError(
          `Role name "${updates.role_name}" already exists`,
        );
      }

      // Any other database error
      throw new DatabaseError_DONT_USE(error.message);
    }

    if (!data) {
      throw new NotFoundError(
        `Role with ID "${roleId}" not found -> No data returned`,
      );
    }

    return data;
  };

  /**
   * Deletes a role.
   *
   * @param roleId - The ID of the role to delete
   * @returns A promise resolving to success status
   * @throws {NotFoundError} If the role does not exist
   * @throws {InvalidOperationError_DEPRECATED} If the role is still assigned to users
   * @throws {DatabaseError_DONT_USE} If a database error occurs
   */
  delete = async (roleId: string): RepositoryResult<void> => {
    // ✅ First check if role exists
    const { data: existingRole, error: checkError } = await supabase
      .from(this.roleTable)
      .select("id")
      .eq("id", roleId)
      .maybeSingle();

    if (checkError) throw new DatabaseError_DONT_USE(checkError.message);

    if (!existingRole) {
      throw new NotFoundError(`Role with ID "${roleId}" not found`);
    }

    // ✅ Check if role is assigned to any users
    const { count: assignmentCount, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*", { count: "exact", head: true })
      .eq("role_id", roleId);

    if (countError) throw new DatabaseError_DONT_USE(countError.message);

    if (assignmentCount && assignmentCount > 0) {
      throw new InvalidOperationError_DEPRECATED(
        `Cannot delete role that is assigned to ${assignmentCount} user(s). Remove all user assignments first.`,
      );
    }

    // ✅ Proceed with deletion and verify it succeeded
    const { error, count } = await supabase
      .from(this.roleTable)
      .delete({ count: "exact" })
      .eq("id", roleId);

    if (error) {
      // Foreign key violation: role is still assigned to users (backup safety check)
      if (error.code === "23503") {
        throw new InvalidOperationError_DEPRECATED(
          "Cannot delete role that is assigned to users. Remove all user assignments first.",
        );
      }

      throw new DatabaseError_DONT_USE(error.message);
    }

    // ✅ Verify that a row was actually deleted
    if (count === 0) {
      throw new NotFoundError(`Role with ID "${roleId}" not found`);
    }

    return;
  };

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
