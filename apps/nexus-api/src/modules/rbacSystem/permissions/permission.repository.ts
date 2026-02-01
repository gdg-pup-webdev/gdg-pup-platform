import { RepositoryError, NotFoundError } from "@/classes/ServerError";
import { supabase } from "@/lib/supabase";
import { RepositoryResultList } from "@/types/repository.types";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

type userRolePermission = Tables<"user_role_permission">;

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
 * Typical Usage:
 * - Fetch all permissions or permissions for a specific role.
 * - Create, update, or delete permissions.
 * - Used by the PermissionService for business logic and error handling.
 */
export class PermissionRepository {
  permissionTable = "user_role_permission";
  junctionTable = "user_role_junction";

  constructor() {}

  /**
   * Fetches all permissions assigned to a specific role.
   * @param roleId The Id of the role.
   * @returns { Promise<userRolePermission> }
   */
  async getPermissionsByRole(
    roleId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", roleId);

    if (error) throw new RepositoryError(error.message);

    const { count, error: countError } = await supabase
      .from(this.permissionTable)
      .select("*", { count: "exact", head: true })
      .eq("user_role_id", roleId);

    if (countError) throw new RepositoryError(countError.message);

    return {
      list: data as userRolePermission[],
      count: count || 0,
    };
  }

  /**
   * Fetches all permissions assigned to a specific user.
   *
   * - Finds all roles assigned to ther user via user_role_junction.
   * - Fetches all permission for those roles from user_role_permission.
   *
   * @param userId The Id of the user.
   * @returns { Promise<userRolePermission[]> }
   */
  async getPermissionByUserId(
    userId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    // Get all role IDs assigned to the user
    const { data: junctionRows, error: junctionError } = await supabase
      .from(this.junctionTable)
      .select("role_id")
      .eq("user_id", userId);

    if (junctionError) throw new RepositoryError(junctionError.message);

    const roleIds = (junctionRows ?? []).map((row) => row.role_id);

    if (roleIds.length === 0) {
      return { list: [], count: 0 };
    }

    // Get all permissions for those role IDs
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .in("user_role_id", roleIds);

    if (error) throw new RepositoryError(error.message);

    // Get count for pagination
    const { count, error: countError } = await supabase
      .from(this.permissionTable)
      .select("*", { count: "exact", head: true })
      .in("user_role_in", roleIds);

    if (countError) throw new RepositoryError(countError.message);

    return {
      list: data as userRolePermission[],
      count: count || 0,
    };
  }

  /**
   * Creates a new permission.
   * @param permissionData The permission data to insert.
   * @returns { Promise<userRolePermission> }
   */
  async createPermission(
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<userRolePermission> {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionData)
      .select()
      .single();

    if (error) throw new RepositoryError(error.message);

    return data as userRolePermission;
  }

  /**
   * Updates an existing permission
   * @param permissionId The Id of the permission to update.
   * @param updates The fields to update.
   * @returns { userRolePermission }
   */
  async updatePermission(
    permissionId: string,
    updates: Partial<TablesUpdate<"user_role_permission">>,
  ): Promise<userRolePermission> {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .update(updates)
      .eq("id", permissionId)
      .select()
      .single();

    if (error) {
      // Not found error code from Supabase/PostgREST
      if (error.code === "PGEST116") {
        throw new NotFoundError(
          `Permission with ID "${permissionId}" not found.`,
        );
      }
      throw new RepositoryError(error.message);
    }

    return data as userRolePermission;
  }

  /**
   * Deletes a permission by its Id
   * @param permissionId The Id of the permissio to delete.
   * @returns { success: boolean }
   */
  async deletePermission(permissionId: string): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("id", permissionId);

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  }

  /**
   * Assigns a permission to a role.
   *
   * Single operations
   *
   *    - Inserts a new permission record associated with the specified role.
   *    - Throws error if permission already exists for the role.
   *    - Throws error if role does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionData The permission data to assign
   * @returns { Promise<userRolePermission> }
   */
  async assignPermissionToRole(
    roleId: string,
    permissionData: Omit<TablesInsert<"user_role_permission">, "user_role_id">,
  ): Promise<userRolePermission> {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert({
        ...permissionData,
        user_role_id: roleId,
      })
      .select()
      .single();

    if (error) throw new RepositoryError(error.message);

    return data as userRolePermission;
  }

  /**
   * Assigns multiple permissions to a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Inserts a new permission record associated with the specified role.
   * - Throws error if permission already exists for the role.
   * - Throws error if role does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionData The permission data to assign.
   * @returns { Promise<userRolePermission> }
   */
  async assignMultiplePermissionsToRoleBulk(
    roleId: string,
    permissionDataList: Omit<
      TablesInsert<"user_role_permission">,
      "user_role_id"
    >[],
  ): Promise<userRolePermission[]> {
    if (!permissionDataList.length) return [];

    const insertData = permissionDataList.map((permission) => ({
      ...permission,
      user_role_id: roleId,
    }));

    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(insertData)
      .select();

    if (error) throw new RepositoryError(error.message);

    return data as userRolePermission[];
  }

  /**
   * Removes a permission from a role.
   *
   * Single operations
   *
   * - Deletes the permission record associated with the specified role.
   * - Throws error if permission does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionId The Id of the permission to remove.
   * @returns { Promise<{ success: boolean }> }
   */
  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<{ success: boolean }> {
    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("id", permissionId)
      .eq("user_role_id", roleId);

    if (error) throw new RepositoryError(error.message);

    return { success: false };
  }

  /**
   * Removes multiple permissions from a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Deletes multiple permission records associated with the specified role.
   * - Throws error if any permission does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionIds Array of permission Ids to remove.
   * @returns { Promise<{ success: boolean }> }
   */
  async removePermissionFromRoleBulk(
    roleId: string,
    permissionIds: string[],
  ): Promise<{ success: boolean }> {
    if (!permissionIds.length) return { success: true };

    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("user_role_id", roleId)
      .in("id", permissionIds);

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  }
}

export const permissionRepositoryInstance = new PermissionRepository();
