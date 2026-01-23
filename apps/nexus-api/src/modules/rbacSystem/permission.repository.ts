import { DatabaseError } from "@/classes/ServerError";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types";
import { Tables, TablesInsert } from "@/types/supabase.types";

type permissionRow = Tables<"user_role_permission">;

export class PermissionRepository {
  permissionTable = "user_role_permission";

  constructor() {}

  /**
   * Create permission for a role
   */
  createPermission = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<permissionRow> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .insert(permissionData)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
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
      .eq("user_role_id", roleId);

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
   * Check if permission exists for role + resource
   */
  permissionExists = async (
    roleId: string,
    resouceName: string,
  ): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.permissionTable)
      .select("id")
      .eq("user_role_id", roleId)
      .eq("resource_name", resouceName)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message);
    }

    return !!data;
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

    if (error) throw new DatabaseError(error.message);
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
   */
  deletePermissionsByRole = async (
    roleId: string,
  ): Promise<{ success: true }> => {
    const { error } = await supabase
      .from(this.permissionTable)
      .delete()
      .eq("user_role_id", roleId);

    if (error) throw new DatabaseError(error.message);
    return { success: true };
  };
}

export const permissionRepositoryInstance = new PermissionRepository();
