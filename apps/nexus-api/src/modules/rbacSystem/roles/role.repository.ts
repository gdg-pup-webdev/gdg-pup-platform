import { RepositoryError, NotFoundError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

/**
 * RoleRepository
 * ---------------
 * Handles all database operations for roles and their assignments.
 * All methods throw custom errors for known failure cases.
 *
 * This repository abstracts the Supabase queries and provides a clear API for
 * role management, user-role assignments, and permission aggregation.
 */
export class RoleRepository {
  junctionTable = "user_role_junction"; // Relationship between user and role
  roleTable = "user_role"; // Stores created roles
  userTable = "user"; // User table

  constructor() {}

  /**
   * Fetches a paginated list of all users and their assigned roles.
   *
   * - Uses a join to fetch user and role data in a single query.
   * - Groups roles by user using a map for efficient aggregation.
   * - Returns an array of objects: { user, roles: [...] }
   */
  getAllRolesOfAllUsers = async (
    pageNumber: number,
    pageSize: number,
  ): Promise<RepositoryResultList<{ user: userRow; roles: roleRow[] }>> => {
    const { data, error, count } = await supabase
      .from(this.junctionTable)
      .select(
        `
        user:user_id(*),
        user_role (*, user_role_permission(*))
      `,
        { count: "exact" },
      )
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

    if (error) throw new RepositoryError(error.message);

    // Group roles by user using a map keyed by user ID
    const userMap: Record<string, { user: userRow; roles: roleRow[] }> = {};

    for (const row of data as any[]) {
      const user = row.user;
      const role = row.user_role;
      if (!user || !role) continue;

      // If user not yet in map, initialize their entry
      if (!userMap[user.id]) {
        userMap[user.id] = { user, roles: [] };
      }
      // Add the role to the user's roles array
      userMap[user.id].roles.push(role);
    }

    // Convert the map to an array for the result
    return {
      list: Object.values(userMap),
      count: count || 0,
    };
  };

  /**
   * Fetches all roles assigned to a specific user.
   *
   * - Queries the junction table for the user's roles.
   * - Also fetches the total count for pagination.
   * - Returns an array of role objects.
   */
  getRolesOfUser = async (
    userId: string,
  ): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*, user_role(*, user_role_permission(*))`)
      .eq("user_id", userId);

    if (error) throw new RepositoryError(error.message);

    // Fetch count for pagination
    const { count, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*, user_role(*)", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) throw new RepositoryError(countError.message);

    // Map the junction rows to just the role objects
    return {
      list: data.map((item) => item.user_role as roleRow),
      count: count || 0,
    };
  };

  /**
   * Fetches all roles in the system, including their permissions.
   *
   * - Orders roles by creation date (most recent first).
   * - Returns an array of role objects with permissions.
   */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission (*)`)
      .order("created_at", { ascending: false });

    if (error) throw new RepositoryError(error.message);

    // Fetch count for pagination
    const { count, error: countError } = await supabase
      .from(this.roleTable)
      .select("*", { count: "exact", head: true });

    if (countError) throw new RepositoryError(countError.message);

    return {
      list: data as roleRow[],
      count: count || 0,
    };
  };

  /**
   * Fetches a single role by its ID, including permissions.
   *
   * - Returns null if the role is not found.
   */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission (*)`)
      .eq("id", roleId)
      .maybeSingle(); // Mag rereturn ng null pag walang mahanap

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Checks if a role exists by its name.
   *
   * - Returns true if found, false otherwise.
   */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select("id")
      .eq("role_name", roleName)
      .maybeSingle(); // Returns null if not found

    if (error) throw new RepositoryError(error.message);

    return !!data;
  };

  /**
   * Fetches all users assigned to a specific role.
   *
   * - Returns an array of junction rows (user-role assignments).
   */
  getUsersByRole = async (
    roleId: string,
  ): Promise<RepositoryResultList<userRoleJunctionRow & { user: any }>> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*`)
      .eq("role_id", roleId);

    if (error) throw new RepositoryError(error.message);

    // Fetch count for pagination
    const { count, error: countError } = await supabase
      .from(this.junctionTable)
      .select("*", { count: "exact", head: true })
      .eq("role_id", roleId);

    if (countError) throw new RepositoryError(countError.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  /**
   * Fetches all users who do NOT have the given role.
   *
   * - Uses a NOT IN subquery to exclude users with the specified role.
   * - Returns an array of user objects.
   */
  getUsersWithoutRoles = async (
    roleId: string,
  ): Promise<RepositoryResultList<userRow>> => {
    // Get all users who do NOT have the given roleId in the junction table
    const { data, error, count } = await supabase
      .from(this.userTable)
      .select("*", { count: "exact", head: true })
      .not(
        "id",
        "in",
        supabase
          .from(this.junctionTable)
          .select("user_id")
          .eq("role_id", roleId),
      );

    if (error) throw new RepositoryError(error.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  // =========================================================================================== //

  /**
   * Creates a new role.
   *
   * - Throws RepositoryError if a role with the same name already exists.
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
      // Handle unique constraint violation (duplicate role name)
      if (error.code === "23505") {
        throw new RepositoryError(
          `Role "${roleData.role_name}" already exists`,
        );
      }
      throw new RepositoryError(error.message);
    }

    return data;
  };

  /**
   * Updates an existing role.
   *
   * - Throws NotFoundError if the role does not exist.
   * - Throws RepositoryError if updating to a duplicate role name.
   */
  updateRole = async (
    roleId: string,
    updates: Partial<TablesUpdate<"user_role">>,
  ): Promise<roleRow> => {
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
        throw new RepositoryError(
          `Role name "${updates.role_name}" already exists`,
        );
      }
      throw new RepositoryError(error.message);
    }
    return data;
  };

  /**
   * Deletes a role.
   *
   * - Throws RepositoryError if the role is still assigned to users.
   */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", roleId);

    if (error) {
      // Foreign key violation: role is still assigned to users
      if (error.code === "23503") {
        throw new RepositoryError(
          "Canner delete role that is assigned to users. Remove all user assignments first.",
        );
      }
      throw new RepositoryError(error.message);
    }

    return { success: true };
  };

  /**
   * Assigns a role to a user.
   *
   * - Throws RepositoryError if already assigned.
   * - Throws NotFoundError if user or role does not exist.
   */
  assignRoleToUser = async (
    userId: string,
    roleId: string,
  ): Promise<userRoleJunctionRow> => {
    // Inserts a new row in the junction table for the user-role assignment
    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) {
      // Unique constraint violation: user already has this role
      if (error.code === "23505") {
        throw new RepositoryError("User already has this role assigned");
      }
      // Foreign key violation: user or role not found
      if (error.code === "23503") {
        throw new NotFoundError("User or role not found");
      }

      throw new RepositoryError(error.message);
    }

    return data;
  };

  /**
   * Removes a role from a user.
   *
   * - Deletes the user-role assignment from the junction table.
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

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };
}

/**
 * Singleton instance of the RoleRepository for use throughout the app.
 */
export const roleRepositoryInstance = new RoleRepository();
