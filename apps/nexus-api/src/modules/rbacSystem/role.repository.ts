import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import { Tables, TablesInsert } from "@/types/supabase.types.js";
import { models } from "@packages/nexus-api-contracts";

type roleRow = Tables<"user_role">;

export class RoleRepository {
  junctionTable = "user_role_junction";
  roleTable = "user_role";

  constructor() {}

  /**
   * Get all roles of a user
   */
  getRolesOfUser = async (userId: string): RepositoryResultList<roleRow> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*, user_role(*, user_role_permission (*))`)
      .eq("user_id", userId);

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*, user_role(*)", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data.map((item) => item.user_role as roleRow),
      count: count || 0,
    };
  };

  /**
   * Create a new role
   */
  createRole = async (
    roleData: TablesInsert<"user_role">,
  ): Promise<roleRow> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .insert(roleData)
      .select()
      .single();

    if (error) {
      // Check if there is a conflict
      if (error.code === "23505") {
        throw new RepositoryConflictError(
          `Role "${roleData.role_name}" already exists`,
        );
      }
      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Get all roles with permissions
   */
  getAllRoles = async (): RepositoryResultList<roleRow> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*, user_role_permission (*)`)
      .order("created_at", { ascending: false });

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.roleTable)
      .select("*", { count: "exact", head: true });

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data as roleRow[],
      count: count || 0,
    };
  };

  /**
   * Get single row by ID
   */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission (*)`)
      .eq("id", roleId)
      .single();

    if (error && error.code !== "PGRST116") {
      // Error code if no rows returned in POSTGRESS
      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Check if role exists by name
   */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select("id")
      .eq("role_name", roleName)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message);
    }

    return !!data;
  };

  /**
   * Update role
   */
  updateRole = async (
    roleId: string,
    updates: Partial<TablesInsert<"user_role">>,
  ): Promise<roleRow> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .update(updates)
      .eq("id", roleId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  /**
   * Delete role
   */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", roleId);

    if (error) throw new DatabaseError(error.message);
    return { success: true };
  };

  /**
   * Check if role is assigned to any users
   */
  isRoleAssigned = async (roleId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select("id")
      .eq("role_id", roleId)
      .limit(1);

    if (error) throw new DatabaseError(error.message);
    return data && data.length > 0;
  };

  /**
   * Assign role to user
   */
  assignRoleToUser = async (
    userId: string,
    roleId: string,
  ): Promise<unknown> => {
    // Di ko alam kung ano type ng value neto
    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  /**
   * Checks if the user has role
   */
  userHasRole = async (userId: string, roleId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select("id")
      .eq("user_id", userId)
      .eq("role_id", roleId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(error.message);
    }

    return !!data;
  };

  /**
   * Remove role from a user
   */
  removeRoleFromUser = async (
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.junctionTable)
      .delete()
      .eq("user_id", userId)
      .eq("role_id", roleId);

    if (error) throw new DatabaseError(error.message);
    return { success: true };
  };

  /**
   * Get all users with specific role
   */
  getUsersByRole = async (roleId: string): RepositoryResultList<unknown> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*`)
      .eq("role_id", roleId);

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*", { count: "exact", head: true })
      .eq("role_id", roleId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };
}

export const roleRepositoryInstance = new RoleRepository();
