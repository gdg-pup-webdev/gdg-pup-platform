import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";
import { TablesInsert, Tables } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

export class RoleService {
  constructor(
    private roleRepository: RoleRepository = roleRepositoryInstance,
  ) {}

  /** Get all roles of all users */
  getAllRolesOfAllUsers = async (
    pageNumber: number,
    pageSize: number,
  ): Promise<RepositoryResultList<{ user: userRow; roles: roleRow[] }>> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.roleRepository.getAllRolesOfAllUsers(pageNumber, pageSize),
      "getting all roles of all users",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Get all roles assigned to a specific user */
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

  /** Get all roles in the system, with permissions */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getAllRoles(),
      "Getting all roles",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Get a single role by ID */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRoleById(roleId),
      `Getting role name of ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Get all users assigned to a specific role */
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

  /** Get users who do NOT have a specific role */
  getUsersWithoutRoles = async (
    roleId: string,
  ): Promise<RepositoryResultList<userRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getUsersWithoutRoles(roleId),
      "Getting users without roles",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Check if a role exists by name */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.roleExistsByName(roleName),
      `Checking if role ${roleName} exists`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Create a new role */
  createRole = async (
    roleData: TablesInsert<"user_role">,
  ): Promise<roleRow> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.createRole(roleData),
      `creating role ${roleData.role_name}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Update an existing role */
  updateRole = async (
    roleId: string,
    updates: Partial<Tables<"user_role">>,
  ): Promise<roleRow> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.updateRole(roleId, updates),
      `Updating role id ${roleId} with ${JSON.stringify(updates)}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Delete a role */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.deleteRole(roleId),
      `Deleting role id ${roleId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Assign a role to a user */
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

  /** Assign a role to multiple users (bulk) */
  assignRoleToUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<userRoleJunctionRow[]> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.assignRoleToUsers(userIds, roleId),
      "Assigning role to multiple users",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /** Assign multiple roles to a user (bulk) */
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

  /** Remove a role from a user */
  removeRoleFromUser = async (
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await tryCatch(
      async () => this.roleRepository.removeRoleFromUser(userId, roleId),
      `Removing the role id ${roleId} from user id ${userId}`,
    );

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };

  /** Remove a role from multiple users (bulk) */
  removeRoleFromUsers = async (
    userIds: string[],
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { error } = await tryCatch(
      async () =>
        await this.roleRepository.removeRoleFromUsers(userIds, roleId),
      "Removing role from multiple users",
    );

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };

  /** Remove multiple roles from a user (bulk) */
  removeRolesFromUser = async (
    userId: string,
    roleIds: string[],
  ): Promise<{ success: boolean }> => {
    const { error } = await tryCatch(
      async () =>
        await this.roleRepository.removeRolesFromUser(userId, roleIds),
      "Removing roles from a user",
    );

    if (error) throw new RepositoryError(error.message);

    return { success: true };
  };
}

export const roleServiceInstance = new RoleService();
