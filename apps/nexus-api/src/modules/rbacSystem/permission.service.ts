import { RepositoryError } from "@/classes/ServerError";
import { tryCatch } from "@/utils/tryCatch.util";
import { Tables, TablesInsert } from "@/types/supabase.types";
import {
  PermissionRepository,
  permissionRepositoryInstance,
} from "./permission.repository";

type permissionRow = Tables<"user_role_permission">;

export class PermissionService {
  constructor(
    private permissionRepository: PermissionRepository = permissionRepositoryInstance,
  ) {}

  /**
   * Create a new permission for a role
   *
   * Example: Create "events" permission for "webdevlead" role
   * {
   *      user_role_id: "role-uuid",
   *       resource_name: "events",
   *       can_read: true,
   *       can_write: true,
   *       can_update: true,
   *       can_delete: false
   * }
   */
  createPermission = async (
    permissionData: TablesInsert<"user_role_permission">,
  ): Promise<permissionRow> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.createPermission(permissionData),
      "Creating permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Get permission for a specific role and resource
   *
   * Example: Check if "webdevlead" role has "events" permission
   */
  getPermissionByRoleAndResource = async (
    roleId: string,
    resourceName: string,
  ): Promise<permissionRow | null> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.getPermissionByRoleAndResource(
          roleId,
          resourceName,
        ),
      "Getting permission by role and resource",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Update permission
   *
   * Example: Change "webdevlead" to allow deleting events
   * {
   *    can_delete: true
   * }
   */
  updatePermission = async (
    permissionId: string,
    updates: Partial<permissionRow>,
  ): Promise<permissionRow> => {
    const { data, error } = await tryCatch(
      async () =>
        this.permissionRepository.updatePermission(permissionId, updates),
      "Updating permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Delete a single permission
   */
  deletePermission = async (
    permissionId: string,
  ): Promise<{ success: boolean }> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.deletePermission(permissionId),
      "Deleting permission",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Delete all permissions for a role
   * Useful when deleting a role or resetting its permisions
   */
  deletePermissionsByRole = async (
    roleId: string,
  ): Promise<{ success: boolean; deletedCount: number }> => {
    const { data, error } = await tryCatch(
      async () =>
        await this.permissionRepository.deletePermissionsByRole(roleId),
      "Deleting permissions",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };
}

export const permissionControllerInstance = new PermissionService();
