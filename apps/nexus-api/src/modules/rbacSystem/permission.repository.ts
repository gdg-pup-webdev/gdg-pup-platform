import {
  DatabaseError,
  NotFoundError,
  RepositoryConflictError,
} from "@/classes/ServerError";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types";
import { Tables, TablesInsert } from "@/types/supabase.types";

type permissionRow = Tables<"user_role_permission">;

export class PermissionRepository {
  permissionTable = "user_role_permission";

  constructor() {}

  /**
   * Create permission for a role
   *
   */
  createPermission = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<permissionRow> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionData)
      .select()
      .single();

    if (error) {
      // Pag may duplicate na permission, saka sya mag e-error
      if (error.code === "23505") {
        throw new RepositoryConflictError(
          `Permission for resource "${permissionData.resource_name}" already exists for this role.`,
        );
      }

      /** Pag walang role na nahanap na mayroong value ng
       * @params {roleId}
       */
      if (error.code === "23503") {
        throw new NotFoundError("Role not found");
      }

      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Get all permissions for a role
   */
  getPermissionsByRole = async (
    roleId: string,
  ): RepositoryResultList<permissionRow> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", roleId)
      .order("resource_name", { ascending: true });

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.permissionTable)
      .select("*", { count: "exact", head: true })
      .eq("user_role_id", roleId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Get single permission by id
   */
  getPermissionById = async (
    permissionId: string,
  ): Promise<permissionRow | null> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("id", permissionId)
      .maybeSingle(); // Mag rereturn ng null pag walang mahanap

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Get a single permission for a specific role and resource
   */
  getPermissionByRoleAndResource = async (
    roleId: string,
    resourceName: string,
  ): Promise<permissionRow | null> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("*")
      .eq("user_role_id", roleId)
      .eq("resource_name", resourceName)
      .maybeSingle(); // Mag re-return ng null pag walang nahanap

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Update permission
   */
  updatePermission = async (
    permissionId: string,
    updates: Partial<TablesInsert<"user_role_permission">>,
  ): Promise<permissionRow> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .update(updates)
      .eq("id", permissionId)
      .select()
      .single();

    if (error) {
      // Pag walang rows na nareturn
      if (error.code === "PGRST116") {
        throw new NotFoundError(
          `Permission with ID "${permissionId}" not found`,
        );
      }

      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Delete permission
   */
  deletePermission = async (
    permissionId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("id", permissionId);

    if (error) throw new DatabaseError(error.message);

    return { success: true };
  };

  /**
   * Delete all permissions for a role
   * Useful when deleting a role or resetting permissions
   */
  deletePermissionsByRole = async (
    roleId: string,
  ): Promise<{ success: true; deletedCount: number }> => {
    // First, get count of permission to be deleted
    const { count } = await supabase
      .from(this.permissionTable)
      .select("*", { count: "exact", head: true })
      .eq("user_role_id", roleId);

    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("user_role_id", roleId);

    if (error) throw new DatabaseError(error.message);

    return { success: true, deletedCount: count || 0 };
  };
}

export const permissionRepositoryInstance = new PermissionRepository();
