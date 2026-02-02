import { tryCatch } from "@/utils/tryCatch.util";
import {
  PermissionRepository,
  permissionRepositoryInstance,
} from "./permission.repository";
import {
  ServiceError,
  RepositoryError,
  DatabaseError,
  NotFoundError,
} from "@/classes/ServerError";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";
import { RepositoryResultList } from "@/types/repository.types";

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

  /**
   * Fetches all permissions assigned to a specific role.
   * @param roleId The Id of the role.
   * @returns { Promise<userRolePermission> }
   */
  async getPermissionsByRole(
    roleId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.getPermissionsByRole(roleId),
      `Getting permission for user ${roleId}`,
    );

    if (error)
      this.handleServiceError(error, "Failed to get permissions by role");

    return data;
  }

  /**
   * Fetches all permissions assigned to a specific user.
   *
   * - Finds all roles assigned to ther user via user_role_junction.
   * - Fetches all permission for those roles from user_role_permission.
   *
   * @param userId The Id of the user.
   * @returns { Promise<userRolePermission[]> }
   */
  async getPermissionByUserId(
    userId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.getPermissionByUserId(userId),
      `Getting permission for user ${userId}`,
    );

    if (error)
      this.handleServiceError(error, "Failed to get permissions by userId");

    return data;
  }

  /**
   * Creates a new permission.
   * @param permissionData The permission data to insert.
   * @returns { Promise<userRolePermission> }
   */
  async createPermission(
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<userRolePermission> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.createPermission(permissionData),
      `Creating permission for role ${permissionData.user_role_id}`,
    );

    if (error)
      this.handleServiceError(error, "Failed to get create permission");

    return data;
  }

  /**
   * Updates an existing permission
   * @param permissionId The Id of the permission to update.
   * @param updates The fields to update.
   * @returns { userRolePermission }
   */
  async updatePermission(
    permissionId: string,
    updates: Partial<TablesUpdate<"user_role_permission">>,
  ): Promise<userRolePermission> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.updatePermission(permissionId, updates),
      `updating permission ${permissionId}`,
    );

    if (error) this.handleServiceError(error, "Failed to update permission");

    return data;
  }

  /**
   * Deletes a permission by its Id
   * @param permissionId The Id of the permissio to delete.
   * @returns { success: boolean }
   */
  async deletePermission(permissionId: string): Promise<{ success: boolean }> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.deletePermission(permissionId),
      `deleting permission ${permissionId}`,
    );

    if (error) this.handleServiceError(error, "Failed to delete permission");

    return data;
  }

  /**
   * Assigns a permission to a role.
   *
   * Single operations
   *
   *    - Inserts a new permission record associated with the specified role.
   *    - Throws error if permission already exists for the role.
   *    - Throws error if role does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionData The permission data to assign
   * @returns { Promise<userRolePermission> }
   */
  async assignPermissionToRole(
    roleId: string,
    permissionData: Omit<TablesInsert<"user_role_permission">, "user_role_id">,
  ): Promise<userRolePermission> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.assignPermissionToRole(
          roleId,
          permissionData,
        ),
      "Assigning a permission to a role",
    );

    if (error)
      this.handleServiceError(error, "Failed to assign a permission to a role");

    return data;
  }

  /**
   * Assigns multiple permissions to a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Inserts a new permission record associated with the specified role.
   * - Throws error if permission already exists for the role.
   * - Throws error if role does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionData The permission data to assign.
   * @returns { Promise<userRolePermission> }
   */
  async assignPermissionsToRoleInBulk(
    roleId: string,
    permissionDataList: Omit<
      TablesInsert<"user_role_permission">,
      "user_role_id"
    >[],
  ): Promise<userRolePermission[]> {
    if (!permissionDataList.length) return [];

    const { data, error } = await tryCatch(
      async () =>
        this.permissionRepository.assignPermissionsToRoleInBulk(
          roleId,
          permissionDataList,
        ),
      "Assigning Multiple permissions to a role",
    );

    if (error)
      this.handleServiceError(
        error,
        "Failed to assign multiple permissions to role",
      );

    return data;
  }

  /**
   * Removes a permission from a role.
   *
   * Single operations
   *
   * - Deletes the permission record associated with the specified role.
   * - Throws error if permission does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionId The Id of the permission to remove.
   * @returns { Promise<{ success: boolean }> }
   */
  async removePermissioFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<{ success: boolean }> {
    if (!roleId || !permissionId) {
      return { success: false };
    }

    const { data, error } = await tryCatch(
      async () =>
        this.permissionRepository.removePermissionFromRole(
          roleId,
          permissionId,
        ),
      "Removing permission from a role",
    );

    if (error)
      this.handleServiceError(
        error,
        "Failed to remove a permission from a role",
      );

    return data;
  }

  /**
   * Removes multiple permissions from a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Deletes multiple permission records associated with the specified role.
   * - Throws error if any permission does not exist.
   *
   * @param roleId The Id of the role.
   * @param permissionIds Array of permission Ids to remove.
   * @returns { Promise<{ success: boolean }> }
   */
  async removePermissionsFromRoleInBulk(
    roleId: string,
    permissionIds: string[],
  ): Promise<{ success: boolean }> {
    if (!roleId || !permissionIds.length) return { success: false };

    const { data, error } = await tryCatch(
      async () =>
        this.permissionRepository.removePermissionsFromRoleInBulk(
          roleId,
          permissionIds,
        ),
      "Removing multiple permissions to a role",
    );

    if (error)
      this.handleServiceError(
        error,
        "Failed to remove multiple permissions to a role",
      );

    return data;
  }
}

export const permissionServiceInstance = new PermissionService();
