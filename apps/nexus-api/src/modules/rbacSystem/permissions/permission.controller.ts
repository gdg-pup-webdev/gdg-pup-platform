import { ControllerError } from "@/classes/ServerError";
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
   * GET /api/rbac/permissions/role/:roleId
   * Fetches all permissions assigned to a specific role
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

      if (error) throw new ControllerError(error.message);

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
   * GET /api/rbac/permissions/user/:userId
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

      if (error) throw new ControllerError(error.message);

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

      if (error) throw new ControllerError(error.message);

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

      if (error) throw new ControllerError(error.message);

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

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Permission deleted",
        data: data.success,
      });
    },
  );
}

export const permissionControllerInstance = new PermissionController();
