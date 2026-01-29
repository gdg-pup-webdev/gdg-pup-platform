import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { TablesInsert, Tables } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;
type userRolePermission = Tables<"user_role_permission">;

export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance,
  ) {}

  /**
   * Get all roles of all users
   */
  getAllRolesOfAllUsers = async (): Promise<
    Array<{ user: userRow; roles: roleRow[] }>
  > => {
    const { data, error } = await tryCatch(
      async () => await this.getAllRolesOfAllUsers(),
      "getting all roles of all users",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get all roles of a user
   */
  getRolesOfUser = async (
    userId: string,
  ): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRolesOfUser(userId),
      "getting roles of user",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Gat all roles with permissions
   */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getAllRoles(),
      "Getting all roles",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get single role row by ID
   */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRoleById(roleId),
      `Getting role name of ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get all users with specific role
   */
  getUsersByRole = async (
    roleId: string,
  ): Promise<RepositoryResultList<userRoleJunctionRow & { user: any }>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getUsersByRole(roleId),
      `Getting all users with the role id of ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get users without assigned roles
   */
  getUsersWithoutRoles = async (roleId: string): Promise<userRow[]> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getUsersWithoutRoles(roleId),
      "Getting users without roles",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get permission for a user
   */
  getPermissionsForUser = async (
    userId: string,
  ): Promise<userRolePermission[]> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getPermissionsForUser(userId),
      "Getting permissions of user",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Checks if role exists by name
   */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.roleExistsByName(roleName),
      `Checking if role ${roleName} exists`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Create a new role
   */
  createRole = async (
    roleData: TablesInsert<"user_role">,
  ): Promise<roleRow> => {
    // Create role
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.createRole(roleData),
      `creating role ${roleData.role_name}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Update role
   */
  updateRole = async (
    roleId: string,
    updates: Partial<Tables<"user_role">>,
  ): Promise<roleRow> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.updateRole(roleId, updates),
      `Updating role id ${roleId} with ${updates}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Delete Role
   */
  deleteRole = async (roleId: string): Promise<void> => {
    const { error } = await tryCatch(
      async () => await this.roleRepository.deleteRole(roleId),
      `Deleting role id ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return;
  };

  /**
   * Assign a role to user
   */
  assignRoleToUser = async (
    userId: string,
    roleId: string,
  ): Promise<userRoleJunctionRow> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.assignRoleToUser(userId, roleId),
      `Assigning role id ${roleId} to user id ${userId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Assign role to multiple users
   */
  assignRolesToUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<userRoleJunctionRow[]> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.assignRolesToUsers(userIds, roleId),
      "Assigning role to multiple users",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Assign roles to a user
   */
  assignRolesToUser = async (
    userId: string,
    roleIds: string[],
  ): Promise<userRoleJunctionRow[]> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.assignRolesToUser(userId, roleIds),
      "Assigning roles to a user",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Remove the role from a user
   */
  removeRoleFromUser = async (
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await tryCatch(
      async () => this.roleRepository.removeRoleFromUser(userId, roleId),
      `Removing the role id ${roleId} to user id ${userId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };

  /**
   * Remove role to multiple users
   */

  removeRolesToUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.roleRepository.removeRolesFromUsers(userIds, roleId),
      "Removing role to multiple users",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Remove roles to a user
   */
  removeRolesToUser = async (
    userId: string,
    roleIds: string[],
  ): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.removeRolesToUser(userId, roleIds),
      "Removing roles to a user",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };
}

export const roleServiceInstance = new RoleService();
