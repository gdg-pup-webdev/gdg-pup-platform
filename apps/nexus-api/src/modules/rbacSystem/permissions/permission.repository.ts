import {
  RepositoryError,
  NotFoundError,
  DatabaseError,
} from "@/classes/ServerError";
import { supabase } from "@/lib/supabase";
import {
  RepositoryResultList,
  RepositoryResult,
} from "@/types/repository.types";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

type userRolePermission = Tables<"user_role_permission">;

export type PermissionListFilters = {
  roleId?: string;
  userId?: string;
};

/**
 * PermissionRepository
 * ====================
 *
 * Handles all database operations related to permissions in the RBAC system.
 *
 * Responsibilities:
 * - Provides methods to query, create, update, and delete permissions.
 * - Abstracts Supabase queries for the permissions table.
 * - Throws custom errors for known failure cases (e.g., not found, database errors).
 *
 * All methods throw custom errors for known failure cases.
 */
export class PermissionRepository {
  permissionTable = "user_role_permission";
  junctionTable = "user_role_junction";

  constructor() {}

  /**
   * Fetches permissions with optional filters.
   * Can filter by roleId or userId.
   *
   * @param filters - Optional filters (roleId or userId)
   * @returns A promise resolving to a list of permissions and total count
   * @throws {DatabaseError} If a database error occurs
   */
  listPermissionsWithFilters = async (
    filters: PermissionListFilters = {},
  ): RepositoryResultList<userRolePermission> => {
    const { roleId, userId } = filters;

    // If filtering by userId, get all role IDs first
    if (userId) {
      const { data: junctionRows, error: junctionError } = await supabase
        .from(this.junctionTable)
        .select("role_id")
        .eq("user_id", userId);

      if (junctionError) throw new DatabaseError(junctionError.message);

      const roleIds = (junctionRows ?? []).map((row) => row.role_id);

      if (roleIds.length === 0) {
        return { list: [], count: 0 };
      }

      // Get all permissions for those role IDs
      const { data, error } = await supabase
        .from(this.permissionTable)
        .select("*")
        .in("user_role_id", roleIds);

      if (error) throw new DatabaseError(error.message);

      const { count, error: countError } = await supabase
        .from(this.permissionTable)
        .select("*", { count: "exact", head: true })
        .in("user_role_id", roleIds);

      if (countError) throw new DatabaseError(countError.message);

      return {
        list: data as userRolePermission[],
        count: count || 0,
      };
    }

    // If filtering by roleId, get permissions for that role
    let query = supabase.from(this.permissionTable).select("*");
    let countQuery = supabase
      .from(this.permissionTable)
      .select("*", { count: "exact", head: true });

    if (roleId) {
      query = query.eq("user_role_id", roleId);
      countQuery = countQuery.eq("user_role_id", roleId);
    }

    const { data, error } = await query;
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await countQuery;
    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data as userRolePermission[],
      count: count || 0,
    };
  };

  /**
   * Creates a new permission.
   * Checks for duplicates before inserting.
   *
   * @param permissionData - The permission data to insert
   * @returns A promise resolving to the created permission
   * @throws {RepositoryError} If a duplicate permission exists
   * @throws {DatabaseError} If a database error occurs
   */
  create = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): RepositoryResult<userRolePermission> => {
    // ✅ Check if permission already exists for this role and resource
    const { data: existing, error: checkError } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", permissionData.user_role_id)
      .eq("resource_name", permissionData.resource_name)
      .maybeSingle();

    if (checkError) throw new DatabaseError(checkError.message);

    if (existing) {
      throw new RepositoryError(
        `Permission for resource "${permissionData.resource_name}" already exists for this role`,
      );
    }

    // Proceed with creation
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionData)
      .select()
      .single();

    if (error) {
      // Duplicate permission (shouldn't happen due to check above)
      if (error.code === "23505") {
        throw new RepositoryError(
          `Permission for resource "${permissionData.resource_name}" already exists for this role`,
        );
      }

      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError("Failed to create permission - no data returned");
    }

    return data;
  };

  /**
   * Updates an existing permission.
   *
   * @param permissionId - The ID of the permission to update
   * @param updates - The fields to update
   * @returns A promise resolving to the updated permission
   * @throws {NotFoundError} If the permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  update = async (
    permissionId: string,
    updates: Partial<TablesUpdate<"user_role_permission">>,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .update(updates)
      .eq("id", permissionId)
      .select()
      .single();

    if (error) {
      // Not found error code from Supabase/PostgREST
      if (error.code === "PGRST116") {
        throw new NotFoundError(
          `Permission with ID "${permissionId}" not found`,
        );
      }
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new NotFoundError(`Permission with ID "${permissionId}" not found`);
    }

    return data;
  };

  /**
   * Deletes a permission by its ID.
   *
   * @param permissionId - The ID of the permission to delete
   * @returns A promise resolving to void
   * @throws {NotFoundError} If the permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  delete = async (permissionId: string): RepositoryResult<void> => {
    const { error, count } = await supabase
      .from(this.permissionTable)
      .delete({ count: "exact" })
      .eq("id", permissionId);

    if (error) throw new DatabaseError(error.message);

    if (count === 0) {
      throw new NotFoundError(`Permission with ID "${permissionId}" not found`);
    }

    return;
  };

  /**
   * Assigns a permission to a role.
   * Checks for duplicates before inserting.
   *
   * @param roleId - The ID of the role
   * @param permissionData - The permission data to assign
   * @returns A promise resolving to the created permission
   * @throws {RepositoryError} If permission already exists for the role
   * @throws {NotFoundError} If role does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  assignPermissionToRole = async (
    roleId: string,
    permissionData: Omit<TablesInsert<"user_role_permission">, "user_role_id">,
  ): RepositoryResult<userRolePermission> => {
    // Check if permission already exists for this role
    const { data: existing, error: checkError } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", roleId)
      .eq("resource_name", permissionData.resource_name)
      .maybeSingle();

    if (checkError) throw new DatabaseError(checkError.message);

    if (existing) {
      throw new RepositoryError(
        `Permission for resource "${permissionData.resource_name}" already exists for this role`,
      );
    }

    // Proceed with assignment
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert({
        ...permissionData,
        user_role_id: roleId,
      })
      .select()
      .single();

    if (error) {
      // Foreign key violation - role doesn't exist
      if (error.code === "23503") {
        throw new NotFoundError(`Role with ID "${roleId}" not found`);
      }

      // Duplicate (shouldn't happen due to check above)
      if (error.code === "23505") {
        throw new RepositoryError(
          `Permission for resource "${permissionData.resource_name}" already exists for this role`,
        );
      }

      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError("Failed to assign permission - no data returned");
    }

    return data;
  };

  /**
   * Assigns multiple permissions to a role in bulk.
   *
   * @param roleId - The ID of the role
   * @param permissionDataList - Array of permission data to assign
   * @returns A promise resolving to an array of created permissions
   * @throws {RepositoryError} If any permission already exists for the role
   * @throws {NotFoundError} If role does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  assignPermissionsToRoleInBulk = async (
    roleId: string,
    permissionDataList: Omit<
      TablesInsert<"user_role_permission">,
      "user_role_id"
    >[],
  ): RepositoryResult<userRolePermission[]> => {
    if (!permissionDataList.length) return [];

    const insertData = permissionDataList.map((permission) => ({
      ...permission,
      user_role_id: roleId,
    }));

    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(insertData)
      .select();

    if (error) {
      // Duplicate error
      if (error.code === "23505") {
        throw new RepositoryError(
          "One or more permissions already exist for this role",
        );
      }

      // Foreign key violation - role doesn't exist
      if (error.code === "23503") {
        throw new NotFoundError(`Role with ID "${roleId}" not found`);
      }

      throw new DatabaseError(error.message);
    }

    if (!data || data.length === 0) {
      throw new DatabaseError(
        "Failed to assign permissions - no data returned",
      );
    }

    return data;
  };

  /**
   * Removes a permission from a role.
   *
   * @param roleId - The ID of the role
   * @param permissionId - The ID of the permission to remove
   * @returns A promise resolving to void
   * @throws {NotFoundError} If the permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  removePermissionFromRole = async (
    roleId: string,
    permissionId: string,
  ): RepositoryResult<void> => {
    const { error, count } = await supabase
      .from(this.permissionTable)
      .delete({ count: "exact" })
      .eq("id", permissionId)
      .eq("user_role_id", roleId);

    if (error) throw new DatabaseError(error.message);

    if (count === 0) {
      throw new NotFoundError(
        `Permission with ID "${permissionId}" not found for role "${roleId}"`,
      );
    }

    return;
  };

  /**
   * Removes multiple permissions from a role in bulk.
   *
   * @param roleId - The ID of the role
   * @param permissionIds - Array of permission IDs to remove
   * @returns A promise resolving to void
   * @throws {NotFoundError} If any permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  removePermissionsFromRoleInBulk = async (
    roleId: string,
    permissionIds: string[],
  ): RepositoryResult<void> => {
    if (!permissionIds.length) return;

    const { error, count } = await supabase
      .from(this.permissionTable)
      .delete({ count: "exact" })
      .eq("user_role_id", roleId)
      .in("id", permissionIds);

    if (error) throw new DatabaseError(error.message);

    if (count === 0) {
      throw new NotFoundError(
        `No permissions found for role "${roleId}" with the provided IDs`,
      );
    }

    return;
  };
}

export const permissionRepositoryInstance = new PermissionRepository();
