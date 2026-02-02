import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import {
  ServiceError,
  RepositoryError,
  NotFoundError,
  DatabaseError,
  ServerError,
} from "@/classes/ServerError.js";
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

  /**
   * Checks if an error is a known ServerError type.
   * Known errors are rethrown with context, unknown errors are wrapped as ServiceError.
   */
  private isKnownError(
    error: any,
  ): error is RepositoryError | NotFoundError | DatabaseError {
    return (
      error instanceof RepositoryError ||
      error instanceof NotFoundError ||
      error instanceof DatabaseError
    );
  }

  /**
   * Handles errors: known errors are rethrown, unknown errors are wrapped as ServiceError.
   */
  private handleServiceError(error: any, context: string): never {
    if (this.isKnownError(error)) {
      throw error; // Rethrow known errors
    }
    // Wrap unknown errors as ServiceError
    throw new ServiceError(`${context}: ${error.message}`);
  }

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

    if (error)
      this.handleServiceError(error, "Failed to get all roles of all users");

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

    // Known errors (RepositoryError, NotFoundError, DatabaseError) are rethrown by tryCatch
    // Unknown errors (syntax errors, etc.) are returned here
    if (error) this.handleServiceError(error, "Failed to get roles");

    return data;
  };

  /** Get all roles in the system, with permissions */
  getAllRoles = async (): Promise<RepositoryResultList<roleRow>> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getAllRoles(),
      "Getting all roles",
    );

    if (error) this.handleServiceError(error, "Failed to get all roles");

    return data;
  };

  /** Get a single role by ID */
  getRoleById = async (roleId: string): Promise<roleRow | null> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.getRoleById(roleId),
      `Getting role name of ${roleId}`,
    );

    if (error) this.handleServiceError(error, "Failed to get role by id");

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

    if (error) this.handleServiceError(error, "Failed to get users by role");

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

    if (error)
      this.handleServiceError(error, "Failed to get users without roles");

    return data;
  };

  /** Check if a role exists by name */
  roleExistsByName = async (roleName: string): Promise<boolean> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.roleExistsByName(roleName),
      `Checking if role ${roleName} exists`,
    );

    if (error)
      this.handleServiceError(error, "Failed to check if role exists by name");

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

    if (error) this.handleServiceError(error, "Failed to create role");

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

    if (error) this.handleServiceError(error, "Failed to update role");

    return data;
  };

  /** Delete a role */
  deleteRole = async (roleId: string): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () => await this.roleRepository.deleteRole(roleId),
      `Deleting role id ${roleId}`,
    );

    if (error) this.handleServiceError(error, "Failed to delete role");

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

    if (error) this.handleServiceError(error, "Failed to assign role");

    return data;
  };

  /** Remove a role from a user */
  removeRoleFromUser = async (
    userId: string,
    roleId: string,
  ): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () => this.roleRepository.removeRoleFromUser(userId, roleId),
      `Removing the role id ${roleId} from user id ${userId}`,
    );

    if (error)
      this.handleServiceError(error, "Failed to remove role from user");

    return data;
  };
}

export const roleServiceInstance = new RoleService();
