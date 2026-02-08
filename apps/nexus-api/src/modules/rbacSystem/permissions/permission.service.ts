import { tryCatch } from "@/utils/tryCatch.util";
import {
  PermissionRepository,
  permissionRepositoryInstance,
  PermissionListFilters,
} from "./permission.repository";
import { RepositoryError } from "@/classes/ServerError";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";
import {
  RepositoryResultList,
  RepositoryResult,
} from "@/types/repository.types";

type userRolePermission = Tables<"user_role_permission">;

/**
 * PermissionService
 * =================
 *
 * The PermissionService class is the business logic layer for permission management in the RBAC system.
 *
 * Responsibilities:
 * - Acts as an intermediary between controllers (API layer) and the PermissionRepository (database layer).
 * - Wraps all repository calls with error handling using the tryCatch utility, adding context for debugging.
 * - Converts repository errors into ServiceError instances for consistent error handling in higher layers.
 * - Implements business logic for permission management, including querying, creating, updating, and deleting permissions.
 * - Ensures all returned data is properly shaped for controllers and API responses.
 */
export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository = permissionRepositoryInstance,
  ) {}

  /**
   * Fetches permissions with optional filters.
   * Can filter by roleId or userId.
   *
   * @param filters - Optional filters (roleId or userId)
   * @returns A promise resolving to a list of permissions
   * @throws {RepositoryError} If the repository operation fails
   */
  listPermissionsWithFilters = async (
    filters: PermissionListFilters = {},
  ): RepositoryResultList<userRolePermission> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.listPermissionsWithFilters(filters),
      "calling repository to list permissions with filters",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Fetches a single permission by its ID.
   *
   * @param permissionId - The ID of the permission
   * @returns A promise resolving to the permission data
   * @throws {RepositoryError} If the repository operation fails
   */
  getPermission = async (
    permissionId: string,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.getPermission(permissionId),
      "calling repository to get permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Creates a new permission.
   *
   * @param permissionData - The permission data to insert
   * @returns A promise resolving to the created permission
   * @throws {RepositoryError} If the repository operation fails or duplicate permission exists
   */
  createPermission = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.create(permissionData),
      "calling repository to create permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Creates multiple permissions in bulk.
   *
   * @param permissionDataList - Array of complete permission data to insert
   * @returns A promise resolving to an array of created permissions
   * @throws {RepositoryError} If the repository operation fails
   */
  createPermissionsInBulk = async (
    permissionDataList: TablesInsert<"user_role_permission">[],
  ): RepositoryResult<userRolePermission[]> => {
    if (!permissionDataList.length) return [];

    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.createBulk(permissionDataList),
      "calling repository to create permissions in bulk",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Updates an existing permission.
   *
   * @param permissionId - The ID of the permission to update
   * @param updates - The fields to update
   * @returns A promise resolving to the updated permission
   * @throws {RepositoryError} If the repository operation fails
   */
  updatePermission = async (
    permissionId: string,
    updates: Partial<TablesUpdate<"user_role_permission">>,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.update(permissionId, updates),
      "calling repository to update permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Deletes a permission by its ID.
   *
   * @param permissionId - The ID of the permission to delete
   * @returns A promise resolving to void
   * @throws {RepositoryError} If the repository operation fails
   */
  deletePermission = async (permissionId: string): RepositoryResult<void> => {
    const { error } = await tryCatch(
      async () => await this.permissionRepository.delete(permissionId),
      "calling repository to delete permission",
    );

    if (error) throw new RepositoryError(error.message);

    return;
  };

  /**
   * Deletes multiple permissions by their IDs.
   *
   * @param permissionIds - Array of permission IDs to delete
   * @returns A promise resolving to void
   * @throws {RepositoryError} If the repository operation fails
   */
  deletePermissionsInBulk = async (
    permissionIds: string[],
  ): RepositoryResult<void> => {
    if (!permissionIds.length) return;

    const { error } = await tryCatch(
      async () => await this.permissionRepository.deleteBulk(permissionIds),
      "calling repository to delete permissions in bulk",
    );

    if (error) throw new RepositoryError(error.message);

    return;
  };

  /**
   * Assigns a permission to a role.
   *
   * Note: The controller should merge roleId from URL params with permission data before calling this.
   *
   * @param permissionData - The complete permission data to assign (including user_role_id)
   * @returns A promise resolving to the created permission
   * @throws {RepositoryError} If the repository operation fails or duplicate exists
   */
  assignPermissionToRole = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): RepositoryResult<userRolePermission> => {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.assignToRole(permissionData),
      "calling repository to assign permission to role",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Assigns multiple permissions to a role in bulk.
   *
   * Note: The controller should merge roleId from URL params with each permission data item before calling this.
   *
   * @param permissionDataList - Array of complete permission data to assign
   * @returns A promise resolving to an array of created permissions
   * @throws {RepositoryError} If the repository operation fails
   */
  assignPermissionsToRoleInBulk = async (
    permissionDataList: TablesInsert<"user_role_permission">[],
  ): RepositoryResult<userRolePermission[]> => {
    if (!permissionDataList.length) return [];

    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.assignToRoleInBulk(permissionDataList),
      "calling repository to assign permissions to role in bulk",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Removes a permission from a role.
   *
   * @param roleId - The ID of the role
   * @param permissionId - The ID of the permission to remove
   * @returns A promise resolving to void
   * @throws {RepositoryError} If the repository operation fails
   */
  removePermissionFromRole = async (
    permissionId: string,
  ): RepositoryResult<void> => {
    const { error } = await tryCatch(
      async () => await this.permissionRepository.removeFromRole(permissionId),
      "calling repository to remove permission from role",
    );

    if (error) throw new RepositoryError(error.message);

    return;
  };

  /**
   * Removes multiple permissions from a role in bulk.
   *
   * @param roleId - The ID of the role
   * @param permissionIds - Array of permission IDs to remove
   * @returns A promise resolving to void
   * @throws {RepositoryError} If the repository operation fails
   */
  removePermissionsFromRoleInBulk = async (
    permissionIds: string[],
  ): RepositoryResult<void> => {
    if (!permissionIds.length) return;

    const { error } = await tryCatch(
      async () =>
        await this.permissionRepository.removeFromRoleInBulk(permissionIds),
      "calling repository to remove permissions from role in bulk",
    );

    if (error) throw new RepositoryError(error.message);

    return;
  };
}

export const permissionServiceInstance = new PermissionService();
