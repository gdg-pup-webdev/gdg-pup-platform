import {
  ControllerError,
  RepositoryError,
  ServiceError,
  DatabaseError,
  NotFoundError,
} from "@/classes/ServerError";
import {
  PermissionService,
  permissionServiceInstance,
} from "./permission.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * PermissionController
 * ====================
 *
 * The PermissionController class defines all HTTP endpoints for permission management in the RBAC system.
 *
 * Responsibilities:
 * - Maps REST API routes to business logic in PermissionService.
 * - Handles request validation, input parsing, and response formatting.
 * - Wraps service errors as ControllerError for consistent error handling and API responses.
 * - Supports querying, creating, updating, and deleting permissions.
 *
 * Usage:
 * - Each method is a RequestHandler for Express, created via createExpressController for typed contract support.
 * - All responses include status, message, data, and pagination meta where applicable.
 * - Errors are caught and wrapped as ControllerError for standardized error responses.
 */
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService = permissionServiceInstance,
  ) {}

  /**
   * Checks if an error is a known ServerError type.
   * Known errors are rethrown with context, unknown errors are wrapped as ServiceError.
   */
  private KnownErrors(
    error: any,
  ): error is ServiceError | NotFoundError | DatabaseError | RepositoryError {
    return (
      error instanceof RepositoryError ||
      error instanceof NotFoundError ||
      error instanceof ServiceError ||
      error instanceof DatabaseError
    );
  }

  /**
   * Handles errors: known errors are rethrown, unknown errors are wrapped as ServiceError.
   */
  private handleControllerError(error: any, context: string): never {
    if (this.KnownErrors(error)) {
      throw error; // Rethrow known errors
    }

    // Wrap unknown errors as ControllerError
    throw new ControllerError(`${context}: ${error.message}`);
  }

  /**
   * GET /api/rbac/permissions/:roleId
   * Fetches all permissions assigned to a specific role
   *
   * - Finds all roles assigned to ther user via user_role_junction.
   * - Fetches all permission for those roles from user_role_permission.
   */
  getPermissionsByRole: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roleId.GET,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { data, error } = await tryCatch(
        async () => await this.permissionService.getPermissionsByRole(roleId),
        `Getting permission for role ${roleId}`,
      );

      if (error)
        this.handleControllerError(error, "Failed to get permissions by role");

      return output(200, {
        status: "success",
        message: "Fetched permissions for role",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  /**
   * GET /api/rbac/permissions/:userId
   * Fetches all permissions assigned to a specific user.
   */
  getPermissionByUserId: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.userId.GET,
    async ({ input, output }) => {
      const userId = input.params.userId;
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { data, error } = await tryCatch(
        async () => await this.permissionService.getPermissionByUserId(userId),
        `Getting permissions for user ${userId}`,
      );

      if (error)
        this.handleControllerError(
          error,
          "Failed to get Permissions by userId",
        );

      return output(200, {
        status: "success",
        message: "Fetched permissions for user",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  /**
   * POST /api/rbac/permissions
   * Creates a new permission.
   */
  createPermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.POST,
    async ({ input, output }) => {
      const permissionData = input.body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.createPermission(permissionData),
        "creating permission",
      );

      if (error)
        this.handleControllerError(error, "Failed to create permission");

      return output(200, {
        status: "success",
        message: "Permission created",
        data,
      });
    },
  );

  /**
   * PATCH /api/rbac/permissions/:permissionId
   * Updates an existing permission.
   */
  updatePermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.permissionId.PATCH,
    async ({ input, output }) => {
      const permissionId = input.params.permissionId;
      const updates = input.body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.updatePermission(permissionId, updates),
        `Updating permission ${permissionId}`,
      );

      if (error)
        this.handleControllerError(error, "Failed to update permission");

      return output(200, {
        status: "success",
        message: "Pemission update",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac/permissions/:permissionId
   * Deletes a permission by its ID.
   */
  deletePermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.permissionId.DELETE,
    async ({ input, output }) => {
      const permissionId = input.params.permissionId;

      const { data, error } = await tryCatch(
        async () => await this.permissionService.deletePermission(permissionId),
        `Deleting permission ${permissionId}`,
      );

      if (error)
        this.handleControllerError(error, "Failed to delete permission");

      return output(200, {
        status: "success",
        message: "Permission deleted",
        data: data.success,
      });
    },
  );

  /**
   * POST /api/rbac/permissions/:roleId
   * Assigns a permission to a role.
   *
   * Single operations
   *
   *    - Inserts a new permission record associated with the specified role.
   *    - Throws error if permission already exists for the role.
   *    - Throws error if role does not exist.
   */
  assignPermissionToRole: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roleId.POST,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const permissionData = input.body.permissionData;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.assignPermissionToRole(
            roleId,
            permissionData,
          ),
        "Assigning permission to a role",
      );

      if (error)
        this.handleControllerError(
          error,
          "Failed to assign permission to a role",
        );

      return output(200, {
        status: "success",
        message: "Successfully assigned permission to role",
        data,
      });
    },
  );

  /**
   * POST /api/rbac/permissions/:roleId/bulk/assign
   * Assigns multiple permissions to a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Inserts a new permission record associated with the specified role.
   * - Throws error if permission already exists for the role.
   * - Throws error if role does not exist.
   */
  assignPermissionsToRoleInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roleId.bulk.assign.POST,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const permissionDataList = input.body.permissionData;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.assignPermissionsToRoleInBulk(
            roleId,
            permissionDataList,
          ),
        "Assigning permissions to a role in bulk",
      );

      if (error)
        this.handleControllerError(
          error,
          "Failed to assign permissions to a role in bulk",
        );

      return output(200, {
        status: "success",
        message: "Successfully assigned permissions to a role in bulk",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac/permissions/:roleId/:permissionId
   * Removes a permission from a role.
   *
   * Single operations
   *
   * - Deletes the permission record associated with the specified role.
   * - Throws error if permission does not exist.
   */
  removePermissionFromRole: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roleId.permissionId.DELETE,
    async ({ input, output }) => {
      const { roleId, permissionId } = input.params;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.removePermissioFromRole(
            roleId,
            permissionId,
          ),
        "Removing permission to a role",
      );

      if (error)
        this.handleControllerError(
          error,
          "Failed to remove permsssion to a role",
        );

      return output(200, {
        status: "succcess",
        message: "Successfully removed permission to a role",
        data: data.success,
      });
    },
  );

  /**
   * DELETE /api/rbac/permissions/:roleId/bulk/remove
   * Removes multiple permissions from a role (bulk).
   *
   * Bulk (prefix with "bulk" or use array parameter as indicator)
   *
   * - Deletes multiple permission records associated with the specified role.
   * - Throws error if any permission does not exist.
   */
  removePermissionsFromRoleInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roleId.bulk.remove.DELETE,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const permissionIds = input.body.permissionIds;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.removePermissionsFromRoleInBulk(
            roleId,
            permissionIds,
          ),
        "Removing permissions to a role in bulk",
      );

      if (error)
        this.handleControllerError(
          error,
          "Failed to remove permissioons to a role in bulk",
        );

      return output(200, {
        status: "success",
        message: "Successfully removed permissions to a role in bulk",
        data: data.success,
      });
    },
  );
}

export const permissionControllerInstance = new PermissionController();
