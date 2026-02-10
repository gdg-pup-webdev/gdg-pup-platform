import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { RoleRepository, roleRepositoryInstance } from "./role.repository.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";
import { TablesInsert, Tables, TablesUpdate } from "@/types/supabase.types.js";
import { RepositoryResultList } from "@/types/repository.types.js";
import {
  roleFilters,
  roleInsert,
  rolePermissionInsert,
  roleUpdate,
} from "./role.types.js";
import { InternalServerError, NotFoundError } from "@/errors/HttpError.js";

type roleRow = Tables<"user_role">;
type userRow = Tables<"user">;
type userRoleJunctionRow = Tables<"user_role_junction">;

/**
 * @deprecated
 */
export type RoleListFilters_DEPRECATED = {
  userId?: string | null;
};

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
   * returns paginated list of roles.
   * filters:
   * - userId - id of user the role is assigned to
   * - resource - name of the resource the role has permission to
   * - action - roles with specific action towards a resource
   */
  listRoles = async (
    pageNumber: number,
    pageSize: number,
    filters: roleFilters,
  ) => {
    return await this.roleRepository.listRoles(pageNumber, pageSize, filters);
  };

  createOneRole = async (dto: roleInsert) => {
    const data = await this.roleRepository.createRoles([dto]);
 

    return data[0] ;
  };

  assignOneRoleToManyUsers = async (roleId: string, userIds: string[]) => {
    return await this.roleRepository.assignRolesToUsers([roleId], userIds);
  };

  attachManyPermissionsToOneRole = async (
    roleId: string,
    permissions: rolePermissionInsert[],
  ) => {
    return await this.roleRepository.attachPermissionsToRoles(
      [roleId],
      permissions,
    );
  };

  deleteOneRole = async (roleId: string) => {
    return await this.roleRepository.deleteRole(roleId);
  };

  getOneRole = async (roleId: string) => {
    const data = await this.roleRepository.listRoles(1, 1, { roleId: roleId });

    if (data.list.length < 1) {
      throw new NotFoundError("Role not found");
    }

    return data.list[0];
  };

  updateOneRole = async (roleId: string, dto: roleUpdate) => {
    return await this.roleRepository.updateRole(roleId, dto);
  };

  detachManyPermissionsFromOneRole = async (
    roleId: string,
    permissions: rolePermissionInsert[],
  ) => {
    return await this.roleRepository.detachPermissionsFromRoles(
      [roleId],
      permissions,
    );
  };

  removeOneRoleFromOneUser = async (userId: string, roleId: string) => {
    await this.roleRepository.unassignRolesFromUsers([roleId], [userId]);

    const currentRoles = await this.roleRepository.listRoles(1, 1, {
      userId: userId,
    });

    return currentRoles.list;
  };

  /**
   * Retrieves a single role by its ID.
   *
   * @param roleId - The ID of the role
   * @returns A promise resolving to the role data
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails
   * @throws {NotFoundError} If the role is not found
   */
  getRole = async (roleId: string) => {
    return await this.roleRepository.getRole(roleId);
  };

  /**
   * Lists all roles with pagination applied.
   *
   * @param pageNumber - Current page number (1-indexed)
   * @param pageSize - Number of items per page
   * @returns A promise resolving to a list of roles
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails
   */
  listRoless = async (
    pageNumber: number,
    pageSize: number,
    filters: roleFilters = {},
  ) => {
    return await this.listRoles(pageNumber, pageSize, filters);
  };

  /**
   * Retrieves all users with their assigned roles (paginated).
   *
   * @param pageNumber - Current page number (1-indexed)
   * @param pageSize - Number of items per page
   * @returns A promise resolving to grouped user-role data
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails
   * @throws {NotFoundError} If no data is found
   */
  listUsersWithRoles = async (
    pageNumber: number,
    pageSize: number,
    filters?: {
      roleId?: string;
      withoutRoles?: boolean;
    },
  ) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.roleRepository.listUsersWithRoles(
          pageNumber,
          pageSize,
          filters,
        ),
      "calling repository to list users with roles",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Updates an existing role.
   *
   * @param roleId - The ID of the role to update
   * @param updates - Partial role data to update
   * @returns A promise resolving to the updated role
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails
   * @throws {NotFoundError} If the role does not exist
   */
  updateRole = async (
    roleId: string,
    updates: Partial<TablesUpdate<"user_role">>,
  ) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.roleRepository.updateRole(roleId, updates),
      "calling repository to update role",
    );

    if (error) {
      // Repository handles both NotFoundError and duplicate name RepositoryError
      throw new RepositoryError_DEPRECATED(error.message);
    }

    return data;
  };

  /**
   * Deletes a role.
   * First checks if the role is assigned to any users.
   *
   * @param roleId - The ID of the role to delete
   * @returns A promise resolving to success status
   * @throws {RepositoryError_DEPRECATED} If the role is still assigned to users
   * @throws {NotFoundError} If the role does not exist
   */
  deleteRoleeeee = async (roleId: string) => {
    // ✅ Check if role is assigned to any users first
    const { data: usersWithRole, error: checkError } =
      await tryCatch_deprecated(
        async () =>
          await this.roleRepository.listUsersWithRoles(1, 1, {
            roleId,
          }),
        "calling repository to check if role is assigned",
      );

    if (checkError) throw new RepositoryError_DEPRECATED(checkError.message);

    if (usersWithRole.count > 0) {
      throw new RepositoryError_DEPRECATED(
        `Cannot delete role that is assigned to ${usersWithRole.count} user(s). Remove all user assignments first.`,
      );
    }

    // Proceed with deletion
    const { error } = await tryCatch_deprecated(
      async () => await this.roleRepository.deleteRole(roleId),
      "calling repository to delete role",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return;
  };

  /**
   * Assigns a role to a user.
   * First checks if the user already has the role to prevent duplicates.
   *
   * @param userId - The ID of the user
   * @param roleId - The ID of the role
   * @returns A promise resolving to the created junction row
   * @throws {RepositoryError_DEPRECATED} If user already has the role or repository operation fails
   * @throws {NotFoundError} If user or role does not exist
   */
  assignRole = async (userId: string, roleId: string) => {
    // First, check if user already has this role
    const { data: existingRoles, error: checkError } =
      await tryCatch_deprecated(
        async () =>
          await this.roleRepository.listRoles(1, 999, {
            userId,
          }),
        "calling repository to list user roles for validation",
      );

    if (checkError) throw new RepositoryError_DEPRECATED(checkError.message);

    // Check if the role is already assigned
    const hasRole = existingRoles.list.some((role) => role.id === roleId);
    if (hasRole) {
      throw new RepositoryError_DEPRECATED(
        "User already has this role assigned",
      );
    }

    // Proceed with assignment
    const { data, error } = await tryCatch_deprecated(
      async () => await this.roleRepository.assignRole(userId, roleId),
      "calling repository to assign role to user",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  /**
   * Removes a role from a user.
   *
   * @param userId - The ID of the user
   * @param roleId - The ID of the role
   * @returns A promise resolving to success status
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails
   */
  removeRole = async (userId: string, roleId: string) => {
    const { error } = await tryCatch_deprecated(
      async () => await this.roleRepository.removeRole(userId, roleId),
      "calling repository to remove role from user",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return;
  };
}

export const roleServiceInstance = new RoleService();
