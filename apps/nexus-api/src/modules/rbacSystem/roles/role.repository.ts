import { DatabaseError, NotFoundError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import { Tables, TablesInsert } from "@/types/supabase.types.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

/**
 * RoleRepository handles all database operations for roles and their assignments.
 * All methods throw custom errors for known failure cases.
 */

export class RoleRepository {
  junctionTable = "user_role_junction"; // Relationship between user and role
  roleTable = "user_role"; // Stores created roles
  userTable = "user"; // User table

  constructor() {}

  /**
   * Returns a paginated list of all users and their roles.
   * Groups roles by user.
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

    if (error) throw new DatabaseError(error.message);

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

  /**
   * Returns all roles assigned to a user, paginated.
   */
  getRolesOfUser = async (
    userId: string,
  ): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select("*, user_role(*)")
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
   * Returns all roles in the system, with permissions, paginated.
   */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await supabase
      .from(this.roleTable)
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
   * Returns a single role by ID, including its permissions.
   * Returns null if not found.
   */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select(`*, user_role_permission (*)`)
      .eq("id", roleId)
      .maybeSingle(); // Mag rereturn ng null pag walang mahanap

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Checks if a role exists by name.
   * Returns true if found, false otherwise.
   */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from(this.roleTable)
      .select("id")
      .eq("role_name", roleName)
      .maybeSingle(); // Mag rereturn ng null pag walang mahanap, hindi mag e-error

    if (error) throw new DatabaseError(error.message);

    return !!data;
  };

  /**
   * Returns all users assigned to a specific role, paginated.
   */
  getUsersByRole = async (
    roleId: string,
  ): Promise<RepositoryResultList<userRoleJunctionRow & { user: any }>> => {
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

  /**
   * Returns all users who do NOT have the given role, paginated.
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

    if (error) throw new DatabaseError(error.message);

    return {
      list: data,
      count: count || 0,
    };
  };

  // =========================================================================================== //

  /**
   * Creates a new role.
   * Throws RepositoryConflictError if role already exists.
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
      // Check if there is a conflict in role (kung may kaparehas ba)
      if (error.code === "23505") {
        throw new DatabaseError(`Role "${roleData.role_name}" already exists`);
      }
      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Updates an existing role.
   * Throws NotFoundError if role not found, RepositoryConflictError if duplicate name.
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

    if (error) {
      // Kapag hindi nahanap yung role
      // yung error na "PGRST116" ay yung error code na lumalabas sa supabase pag walang lumabas na result
      // Usually kapag walang role na nag match
      if (error.code === "PGRST116") {
        throw new NotFoundError(`Role with ID "${roleId}" not found`);
      }
      // Pag may duplicate na role - kung magpapalit lang ng role name
      // Yung "23505" naman ay pag may duplicate row data
      if (error.code === "23505") {
        throw new DatabaseError(
          `Role name "${updates.role_name}" already exists`,
        );
      }
      throw new DatabaseError(error.message);
    }
    return data;
  };

  /**
   * Deletes a role.
   * Throws RepositoryConflictError if role is assigned to users.
   */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", roleId);

    if (error) {
      // Kapag naka assign pa sa user yung role at dinilete mo, mag error sya
      if (error.code === "23503") {
        throw new DatabaseError(
          "Canner delete role that is assigned to users. Remove all user assignments first.",
        );
      }
      throw new DatabaseError(error.message);
    }

    return { success: true };
  };

  /**
   * Assigns a role to a user.
   * Throws RepositoryConflictError if already assigned, NotFoundError if user/role not found.
   */
  assignRoleToUser = async (
    userId: string,
    roleId: string,
  ): Promise<userRoleJunctionRow> => {
    // Mag rereturn sya ng row sa junction table
    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert({
        user_id: userId,
        role_id: roleId,
      })
      .select()
      .single();

    if (error) {
      // gagana lang to kapag nag assign ka ulit ng parehas na role sa user na mayroon na nun
      if (error.code === "23505") {
        throw new DatabaseError("User already has this role assigned");
      }
      // Pag yung user id or yung role id ay wala sa database, mag e-error sya
      if (error.code === "23503") {
        throw new NotFoundError("User or role not found");
      }

      throw new DatabaseError(error.message);
    }

    return data;
  };

  /**
   * Assigns a role to multiple users (bulk).
   * Throws RepositoryConflictError if any user already has the role.
   */
  assignRoleToUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<userRoleJunctionRow[]> => {
    if (!userIds.length) return [];

    const insertData = userIds.map((userId) => ({
      user_id: userId,
      role_id: roleId,
    }));

    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert(insertData)
      .select();

    if (error) {
      // Error kapag yung user ay mayroon na netong role na iaassign
      if (error.code === "23505") {
        throw new DatabaseError(
          "One or more users already have this role assigned",
        );
      }

      // Pag user or role ay hindi mahanap, ,mag eerror to
      if (error.code === "23503") {
        throw new NotFoundError("One or more users or the role not found");
      }

      throw new DatabaseError(error.message);
    }

    return data as userRoleJunctionRow[];
  };

  /**
   * Assigns multiple roles to a user (bulk).
   * Throws RepositoryConflictError if user already has any of the roles.
   */
  assignRolesToUser = async (
    userId: string,
    roleIds: string[],
  ): Promise<userRoleJunctionRow[]> => {
    if (!roleIds.length) return [];

    const insertData = roleIds.map((roleId) => ({
      user_id: userId,
      role_id: roleId,
    }));

    const { data, error } = await supabase
      .from(this.junctionTable)
      .insert(insertData)
      .select();

    if (error) {
      if (error.code === "23505") {
        throw new DatabaseError(
          "User already has one or more of these roles assigned",
        );
      }

      if (error.code === "23503") {
        throw new NotFoundError("user or one or more roles not found");
      }

      throw new DatabaseError(error.message);
    }

    return data as userRoleJunctionRow[];
  };

  /**
   * Removes a role from a user.
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
   * Removes a role from multiple users (bulk).
   */
  removeRoleFromUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.junctionTable)
      .delete()
      .in("user_id", userIds)
      .eq("role_id", roleId);

    if (error) throw new DatabaseError(error.message);

    return { success: true };
  };

  /**
   * Removes multiple roles from a user (bulk).
   */
  removeRolesFromUser = async (
    userId: string,
    roleIds: string[],
  ): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.junctionTable)
      .delete()
      .eq("user_id", userId)
      .in("role_id", roleIds);

    if (error) throw new DatabaseError(error.message);

    return { success: true };
  };
}

export const roleRepositoryInstance = new RoleRepository();
