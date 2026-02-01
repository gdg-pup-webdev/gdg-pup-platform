import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { ServiceError } from "@/classes/ServerError.js";
import { TablesInsert, Tables } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

/**
 * RoleService
 * ===========
 *
 * The RoleService class is the business logic layer for role management in the RBAC system.
 *
 * Responsibilities:
 * - Acts as an intermediary between controllers (API layer) and the RoleRepository (database layer).
 * - Wraps all repository calls with error handling using the tryCatch utility, adding context for debugging.
 * - Converts repository errors into ServiceError instances for consistent error handling in higher layers.
 * - Implements business logic for role management, user-role assignments, bulk operations, and permission checks.
 * - Ensures all returned data is properly shaped for controllers and API responses.
 *
 */
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
    if (error) throw new ServiceError(error.message);

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
    if (error) throw new ServiceError(error.message);

    return data;
  };

  /** Get all roles in the system, with permissions */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getAllRoles(),
      "Getting all roles",
    );

    if (error) throw new ServiceError(error.message);

    return data;
  };

  /** Get a single role by ID */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRoleById(roleId),
      `Getting role name of ${roleId}`,
    );

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

    return data;
  };

  /** Check if a role exists by name */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.roleExistsByName(roleName),
      `Checking if role ${roleName} exists`,
    );

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

    return data;
  };

  /** Delete a role */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.deleteRole(roleId),
      `Deleting role id ${roleId}`,
    );

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

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

    if (error) throw new ServiceError(error.message);

    return { success: true };
  };
}

export const roleServiceInstance = new RoleService();
