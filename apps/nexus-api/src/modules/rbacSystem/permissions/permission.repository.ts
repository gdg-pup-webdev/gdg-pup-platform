import {
  NotFoundError,
  DuplicateResourceError
} from "@/errors/HttpError";
import { RepositoryError } from "@/classes/ServerError";
import { DatabaseError } from "@/errors/HttpError";
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
   * Fetches a single permission by its ID.
   *
   * @param permissionId - The ID of the permission
   * @returns A promise resolving to the permission data
   * @throws {NotFoundError} If permission is not found
   * @throws {DatabaseError} If a database error occurs
   */
  getPermission = async (
    permissionId: string,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("id", permissionId)
      .maybeSingle();

    if (error) throw new DatabaseError(error.message);

    if (!data)
      throw new NotFoundError(`Permission with ID "${permissionId}" not found`);

    return data;
  };

  /**
   * Creates a new permission.
   * Checks for duplicates before inserting to prevent duplicate role-resource combinations.
   *
   * @param permissionData - The permission data to insert
   * @returns A promise resolving to the created permission
   * @throws {DuplicateResourceError} If a duplicate permission exists (same role + resource)
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
      throw new DuplicateResourceError(
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
        throw new DuplicateResourceError(
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
   * Creates multiple permissions in bulk.
   * Validates against duplicates both within the request array and existing database records.
   *
   * @param permissionDataList - Array of complete permission data to insert
   * @returns A promise resolving to an array of created permissions
   * @throws {DuplicateResourceError} If any permission already exists or duplicates within request
   * @throws {DatabaseError} If a database error occurs
   */
  createBulk = async (
    permissionDataList: Array<TablesInsert<"user_role_permission">>,
  ): RepositoryResult<userRolePermission[]> => {
    if (!permissionDataList.length) return [];

    // ✅ Check for duplicates within the request array itself
    const combinations = new Set<string>();
    const duplicatesInRequest: string[] = [];

    for (const perm of permissionDataList) {
      const key = `${perm.user_role_id}:${perm.resource_name}`;
      if (combinations.has(key)) {
        duplicatesInRequest.push(
          `"${perm.resource_name}" for role ${perm.user_role_id}`,
        );
      }
      combinations.add(key);
    }

    if (duplicatesInRequest.length > 0) {
      throw new DuplicateResourceError(
        `Duplicate permissions in request: ${duplicatesInRequest.join(", ")}`,
      );
    }

    // ✅ Check for existing permissions in database
    // Get all unique role IDs from the request
    const roleIds = [...new Set(permissionDataList.map((p) => p.user_role_id))];

    // Fetch all existing permissions for these roles
    const { data: existingPermissions, error: fetchError } = await supabase
      .from(this.permissionTable)
      .select("user_role_id, resource_name")
      .in("user_role_id", roleIds);

    if (fetchError) throw new DatabaseError(fetchError.message);

    // Build a set of existing combinations
    const existingCombinations = new Set(
      (existingPermissions || []).map(
        (p) => `${p.user_role_id}:${p.resource_name}`,
      ),
    );

    // Check if any requested permission already exists
    const conflictingPermissions: string[] = [];
    for (const perm of permissionDataList) {
      const key = `${perm.user_role_id}:${perm.resource_name}`;
      if (existingCombinations.has(key)) {
        conflictingPermissions.push(
          `"${perm.resource_name}" for role ${perm.user_role_id}`,
        );
      }
    }

    if (conflictingPermissions.length > 0) {
      throw new DuplicateResourceError(
        `The following permissions already exist: ${conflictingPermissions.join(", ")}`,
      );
    }

    // ✅ All validations passed, proceed with bulk insert
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionDataList)
      .select();

    if (error) {
      // Duplicate error (last resort catch)
      if (error.code === "23505") {
        throw new DuplicateResourceError(
          "One or more permissions already exist in the database",
        );
      }

      throw new DatabaseError(error.message);
    }

    if (!data || data.length === 0) {
      throw new DatabaseError(
        "Failed to create permissions - no data returned",
      );
    }

    return data;
  };

  /**
   * Updates an existing permission.
   * Prevents updating to a resource_name that would create a duplicate.
   *
   * @param permissionId - The ID of the permission to update
   * @param updates - The fields to update
   * @returns A promise resolving to the updated permission
   * @throws {NotFoundError} If the permission does not exist
   * @throws {DuplicateResourceError} If update would create duplicate
   * @throws {DatabaseError} If a database error occurs
   */
  update = async (
    permissionId: string,
    updates: Partial<TablesUpdate<"user_role_permission">>,
  ): RepositoryResult<userRolePermission> => {
    // ✅ If updating resource_name, check for duplicates
    if (updates.resource_name) {
      // First, get the current permission to know which role it belongs to
      const { data: currentPermission, error: fetchError } = await supabase
        .from(this.permissionTable)
        .select("user_role_id")
        .eq("id", permissionId)
        .maybeSingle();

      if (fetchError) throw new DatabaseError(fetchError.message);
      if (!currentPermission)
        throw new NotFoundError(
          `Permission with ID "${permissionId}" not found`,
        );

      // Check if another permission with same role + new resource_name exists
      const { data: existing, error: checkError } = await supabase
        .from(this.permissionTable)
        .select("id")
        .eq("user_role_id", currentPermission.user_role_id)
        .eq("resource_name", updates.resource_name)
        .neq("id", permissionId) // Exclude current permission
        .maybeSingle();

      if (checkError) throw new DatabaseError(checkError.message);

      if (existing) {
        throw new DuplicateResourceError(
          `Permission for resource "${updates.resource_name}" already exists for this role`,
        );
      }
    }

    // Proceed with update
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
      // Duplicate error (shouldn't happen due to check above)
      if (error.code === "23505") {
        throw new DuplicateResourceError(
          `Permission for resource "${updates.resource_name}" already exists for this role`,
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
   * Deletes multiple permissions by their IDs.
   *
   * @param permissionIds - Array of permission IDs to delete
   * @returns A promise resolving to void
   * @throws {NotFoundError} If no permissions found with provided IDs
   * @throws {DatabaseError} If a database error occurs
   */
  deleteBulk = async (permissionIds: string[]): RepositoryResult<void> => {
    if (!permissionIds.length) return;

    const { error, count } = await supabase
      .from(this.permissionTable)
      .delete({ count: "exact" })
      .in("id", permissionIds);

    if (error) throw new DatabaseError(error.message);

    if (count === 0) {
      throw new NotFoundError("No permissions found with the provided IDs");
    }

    return;
  };

  /**
   * Assigns a permission to a role.
   * Checks for duplicates before inserting to prevent duplicate role-resource combinations.
   *
   * @param permissionData - The complete permission data to assign (including user_role_id)
   * @returns A promise resolving to the created permission
   * @throws {DuplicateResourceError} If permission already exists for the role
   * @throws {DatabaseError} If a database error occurs
   */
  assignToRole = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): RepositoryResult<userRolePermission> => {
    // ✅ Check if permission already exists for this role
    const { data: existing, error: checkError } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", permissionData.user_role_id)
      .eq("resource_name", permissionData.resource_name)
      .maybeSingle();

    if (checkError) throw new DatabaseError(checkError.message);

    if (existing) {
      throw new DuplicateResourceError(
        `Permission for resource "${permissionData.resource_name}" already exists for this role`,
      );
    }

    // Proceed with assignment
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionData)
      .select()
      .single();

    if (error) {
      // Duplicate (shouldn't happen due to check above)
      if (error.code === "23505") {
        throw new DuplicateResourceError(
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
   * Validates against duplicates both within the request array and existing database records.
   *
   * @param permissionDataList - Array of complete permission data to assign
   * @returns A promise resolving to an array of created permissions
   * @throws {DuplicateResourceError} If any permission already exists or duplicates within request
   * @throws {DatabaseError} If a database error occurs
   */
  assignToRoleInBulk = async (
    permissionDataList: TablesInsert<"user_role_permission">[],
  ): RepositoryResult<userRolePermission[]> => {
    if (!permissionDataList.length) return [];

    // ✅ Check for duplicates within the request array itself
    const combinations = new Set<string>();
    const duplicatesInRequest: string[] = [];

    for (const perm of permissionDataList) {
      const key = `${perm.user_role_id}:${perm.resource_name}`;
      if (combinations.has(key)) {
        duplicatesInRequest.push(
          `"${perm.resource_name}" for role ${perm.user_role_id}`,
        );
      }
      combinations.add(key);
    }

    if (duplicatesInRequest.length > 0) {
      throw new DuplicateResourceError(
        `Duplicate permissions in request: ${duplicatesInRequest.join(", ")}`,
      );
    }

    // ✅ Check for existing permissions in database
    const roleIds = [...new Set(permissionDataList.map((p) => p.user_role_id))];

    const { data: existingPermissions, error: fetchError } = await supabase
      .from(this.permissionTable)
      .select("user_role_id, resource_name")
      .in("user_role_id", roleIds);

    if (fetchError) throw new DatabaseError(fetchError.message);

    const existingCombinations = new Set(
      (existingPermissions || []).map(
        (p) => `${p.user_role_id}:${p.resource_name}`,
      ),
    );

    const conflictingPermissions: string[] = [];
    for (const perm of permissionDataList) {
      const key = `${perm.user_role_id}:${perm.resource_name}`;
      if (existingCombinations.has(key)) {
        conflictingPermissions.push(
          `"${perm.resource_name}" for role ${perm.user_role_id}`,
        );
      }
    }

    if (conflictingPermissions.length > 0) {
      throw new DuplicateResourceError(
        `The following permissions already exist: ${conflictingPermissions.join(", ")}`,
      );
    }

    // ✅ All validations passed, proceed with bulk insert
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionDataList)
      .select();

    if (error) {
      if (error.code === "23505") {
        throw new DuplicateResourceError(
          "One or more permissions already exist for this role",
        );
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
   * Removes a permission by its ID.
   *
   * @param permissionId - The ID of the permission to remove
   * @returns A promise resolving to void
   * @throws {NotFoundError} If the permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  removeFromRole = async (permissionId: string): RepositoryResult<void> => {
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
   * Removes multiple permissions from a role in bulk.
   *
   * @param roleId - The ID of the role
   * @param permissionIds - Array of permission IDs to remove
   * @returns A promise resolving to void
   * @throws {NotFoundError} If any permission does not exist
   * @throws {DatabaseError} If a database error occurs
   */
  removeFromRoleInBulk = async (
    permissionIds: string[],
  ): RepositoryResult<void> => {
    if (!permissionIds.length) return;

    const { error, count } = await supabase
      .from(this.permissionTable)
      .delete({ count: "exact" })
      .in("id", permissionIds);

    if (error) throw new DatabaseError(error.message);

    if (count === 0) {
      throw new NotFoundError(`No permissions found with the provided IDs`);
    }

    return;
  };
}

export const permissionRepositoryInstance = new PermissionRepository();
