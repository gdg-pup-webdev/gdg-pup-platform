import {
  DatabaseError,
  NotFoundError,
  RepositoryConflictError,
} from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import { Tables, TablesInsert } from "@/types/supabase.types.js";
import { models } from "@packages/nexus-api-contracts";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;
type userRolePermission = Tables<"user_role_permission">;

export class RoleRepository {
  junctionTable = "user_role_junction"; // Table for the relationship of role and user
  roleTable = "user_role"; // dito naka store yung mga created roles
  userTable = "user"; // User table

  constructor() {}

  /**
   * Get all roles of all users
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

    // Group by user
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
   * Get all roles of a user
   */
  getRolesOfUser = async (
    userId: string,
  ): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select(`*, user_role(*, user_role_permission(*))`)
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
   * Get all roles with permissions
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
   * Get single row by ID
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
   * Check if role exists by name
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
   * Get all users with specific role
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
   * Get users without assigned roles
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

  /**
   * Get permission for a user
   */
  getPermissionsForUser = async (
    userId: string,
  ): Promise<userRolePermission[]> => {
    // Joind user_role_jucntion to user_role and to user_role_permission
    const { data, error } = await supabase
      .from(this.junctionTable)
      .select("user_role:user_role_id(user_role_permission(*))")
      .eq("user_id", userId);

    if (error) throw new DatabaseError(error.message);

    // Flatten all permissions from all users
    const permissions: userRolePermission[] = [];
    for (const row of data as any[]) {
      const role = row.user_role;
      if (role && role.user_role_permission) {
        permissions.push(...role.user_role_permission);
      }
    }

    return permissions;
  };

  // =========================================================================================== //

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
      // Check if there is a conflict in role (kung may kaparehas ba)
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
        throw new RepositoryConflictError(
          `Role name "${updates.role_name}" already exists`,
        );
      }
      throw new DatabaseError(error.message);
    }
    return data;
  };

  /**
   * Delete role
   * Mag fi-fail to po nag delete ng role na naka assign pa sa user
   */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
      .from(this.roleTable)
      .delete()
      .eq("id", roleId);

    if (error) {
      // Kapag naka assign pa sa user yung role at dinilete mo, mag error sya
      if (error.code === "23503") {
        throw new RepositoryConflictError(
          "Canner delete role that is assigned to users. Remove all user assignments first.",
        );
      }
      throw new DatabaseError(error.message);
    }

    return { success: true };
  };

  /**
   * Assign role to user
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
      //* Install ka ng "Better Comments" by 'Aaron Bond' extension para magbago yung kulay ng comment
      //* gagana lang to kapag nag assign ka ulit ng parehas na role sa user na mayroon na nun
      //* example (Keith = backenddev, id = 2)
      //* assignRoleToUser(2, "backenddev")
      if (error.code === "23505") {
        throw new RepositoryConflictError(
          "User already has this role assigned",
        );
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
   * Assign roles to multiple users
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
        throw new RepositoryConflictError(
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
   * Assign multiple roles to a user
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
        throw new RepositoryConflictError(
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
   * Remove role from multiple users
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
   * Remove roles to a user
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
