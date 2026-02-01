import { tryCatch } from "@/utils/tryCatch.util";
import {
  PermissionRepository,
  permissionRepositoryInstance,
} from "./permission.repository";
import { ServiceError } from "@/classes/ServerError";
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
   * Fetches all permissions assigned to a specific role.
   */
  async getPermissionsByRole(
    roleId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.getPermissionsByRole(roleId),
      `Getting permission for user ${roleId}`,
    );

    if (error) throw new ServiceError(error.message);

    return data;
  }

  /**
   * Fetches all permission assigned to a specific user
   */
  async getPermissionByUserId(
    userId: string,
  ): Promise<RepositoryResultList<userRolePermission>> {
    const { data, error } = await tryCatch(
      async () => await this.permissionRepository.getPermissionByUserId(userId),
      `Getting permission for user ${userId}`,
    );

    if (error) throw new ServiceError(error.message);

    return data;
  }

  /**
   * Creates new permission.
   */
  async createPermission(
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<userRolePermission> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.createPermission(permissionData),
      `Creating permission for role ${permissionData.user_role_id}`,
    );

    if (error) throw new ServiceError(error.message);

    return data;
  }

  /**
   * Updates an existing permission.
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
    if (error) throw new ServiceError(error.message);
    return data;
  }

  /**
   * Deletes a permission by its ID.
   */
  async deletePermission(permissionId: string): Promise<{ success: boolean }> {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.deletePermission(permissionId),
      `deleting permission ${permissionId}`,
    );
    if (error) throw new ServiceError(error.message);
    return data;
  }
}

export const permissionServiceInstance = new PermissionService();
