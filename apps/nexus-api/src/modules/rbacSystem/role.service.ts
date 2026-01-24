import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { TablesInsert, Tables } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";

type roleRow = Tables<"user_role">;
type userRoleJunctionRow = Tables<"user_role_junction">;

export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance,
  ) {}

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
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { error } = await tryCatch(
      async () => await this.roleRepository.deleteRole(roleId),
      `Deleting role id ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };

  /**
   * Check if role is assigned to any users
   */
  isRoleAssigned = async (roleId: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.isRoleAssigned(roleId),
      `Checking this role id ${roleId} is assigned to any users`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
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
   * Checks if the user has the specified role
   */
  doUserHasRole = async (userId: string, roleId: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.doUserHasRole(userId, roleId),
      `Checking if user id ${userId} has the role id ${roleId}`,
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
}

export const roleServiceInstance = new RoleService();
