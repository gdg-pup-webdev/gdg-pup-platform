import { ServiceError_DEPRECATED } from "@/classes/ServerError";
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
 * - Wraps service errors as ServiceError for consistent error handling and API responses.
 * - Supports querying, creating, updating, and deleting permissions.
 *
 * Key Endpoints:
 * - GET /api/rbac-system/permissions/role/:roleId - Get permissions for a role
 * - GET /api/rbac-system/permissions/user/:userId - Get permissions for a user
 * - POST /api/rbac-system/permissions - Create a new permission
 * - PATCH /api/rbac-system/permissions/:permissionId - Update a permission
 * - DELETE /api/rbac-system/permissions/:permissionId - Delete a permission
 * - POST /api/rbac-system/permissions/:roleId/assign - Assign permission to role
 * - POST /api/rbac-system/permissions/:roleId/bulk/assign - Bulk assign permissions
 * - DELETE /api/rbac-system/permissions/:roleId/:permissionId - Remove permission from role
 * - DELETE /api/rbac-system/permissions/:roleId/bulk/remove - Bulk remove permissions
 */
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService = permissionServiceInstance,
  ) {}

  /**
   * GET /api/rbac-system/permissions
   * Fetches permissions with optional filters.
   * Can filter by roleId or userId.
   *
   * @route GET /api/rbac-system/permissions
   * @query roleId - Optional role ID to filter permissions by role
   * @query userId - Optional user ID to filter permissions by user
   * @query pageNumber - Current page (1-indexed)
   * @query pageSize - Number of items per page
   * @returns JSON response containing permissions and pagination metadata
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  listPermissions: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.GET,
    async ({ input, output }) => {
      const { roleId, userId, pageNumber = 1, pageSize = 10 } = input.query;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.listPermissionsWithFilters({
            roleId,
            userId,
          }),
        "calling service to list permissions",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permissions fetched successfully",
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
   * GET /api/rbac-system/permissions/:permissionId
   * Fetches a single permission by ID.
   *
   * @route GET /api/rbac-system/permissions/:permissionId
   * @param permissionId - The ID of the permission to fetch
   * @returns JSON response containing the permission
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  getPermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.permissionId.GET,
    async ({ input, output }) => {
      const { permissionId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.permissionService.getPermission(permissionId),
        "calling service to get permission",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission fetched successfully",
        data,
      });
    },
  );

  /**
   * POST /api/rbac-system/permissions
   * Creates a new permission.
   *
   * @route POST /api/rbac-system/permissions
   * @body data - Permission data (resource_name, can_create, can_read, can_update, can_delete, user_role_id)
   * @returns JSON response containing the created permission
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  createPermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.POST,
    async ({ input, output }) => {
      const permissionData = input.body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.createPermission(permissionData),
        "calling service to create permission",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission created successfully",
        data,
      });
    },
  );

  /**
   * POST /api/rbac-system/permissions/bulk-create
   * Creates a new permission but in bulk
   *
   * @route POST /api/rbac-system/permissions/bulk-create
   * @body data - Array of Permission data (resource_name, can_create, can_read, can_update, can_delete, user_role_id)
   * @returns JSON response containing array of created permission
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  createPermissionsInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.bulk_create.POST,
    async ({ input, output }) => {
      const permissionData = input.body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.createPermissionsInBulk(permissionData),
        "calling service to create permission in bulk",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Successfully created permissions",
        data,
      });
    },
  );

  /**
   * PATCH /api/rbac-system/permissions/:permissionId
   * Updates an existing permission.
   *
   * @route PATCH /api/rbac-system/permissions/:permissionId
   * @param permissionId - The ID of the permission to update
   * @body data - Partial permission data to update
   * @returns JSON response containing the updated permission
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  updatePermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.permissionId.PATCH,
    async ({ input, output }) => {
      const permissionId = input.params.permissionId;
      const updates = input.body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.updatePermission(permissionId, updates),
        "calling service to update permission",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission updated successfully",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac-system/permissions/:permissionId
   * Deletes a permission by its ID.
   *
   * @route DELETE /api/rbac-system/permissions/:permissionId
   * @param permissionId - The ID of the permission to delete
   * @returns JSON response confirming deletion
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  deletePermission: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.permissionId.DELETE,
    async ({ input, output }) => {
      const permissionId = input.params.permissionId;

      const { error } = await tryCatch(
        async () => await this.permissionService.deletePermission(permissionId),
        "calling service to delete permission",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission deleted successfully",
      });
    },
  );

  /**
   * DELETE /api/rbac-system/permissions/:permissionId/bulk-delete
   * Deletes a permission by ID in bulk
   *
   * @route DELETE /api/rbac-system/permissions/:permissionId/bulk-delete
   * @param permissionId - Array of ID of the permission to delete
   * @returns JSON response confirming deletion
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  deletePermissionsInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.bulk_delete.DELETE,
    async ({ input, output }) => {
      const permissionIds = input.body.permissionIds;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.deletePermissionsInBulk(permissionIds),
        "calling service to delete permissions in bulk",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Successfully deleted permissions",
      });
    },
  );

  /**
   * POST /api/rbac-system/permissions/roles/assign
   * Assigns a permission to a role.
   *
   * @route POST /api/rbac-system/permissions/roles/assign
   * @param roleId - The ID of the role
   * @body permissionData - Permission data to assign (without user_role_id)
   * @returns JSON response containing the assigned permission
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  assignToRole: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roles.assign.POST,
    async ({ input, output }) => {
      const permissionData = input.body.permissionData;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.assignPermissionToRole(permissionData),
        "calling service to assign permission to role",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission assigned to role successfully",
        data,
      });
    },
  );

  /**
   * POST /api/rbac-system/permissions/:roleId/bulk/assign
   * Assigns multiple permissions to a role in bulk.
   *
   * @route POST /api/rbac-system/permissions/:roleId/bulk/assign
   * @param roleId - The ID of the role
   * @body permissionData - Array of permission data to assign
   * @returns JSON response containing the assigned permissions
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  assignToRoleInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roles.bulk_assign.POST,
    async ({ input, output }) => {
      const permissionDataList = input.body.permissionData;

      const { data, error } = await tryCatch(
        async () =>
          await this.permissionService.assignPermissionsToRoleInBulk(
            permissionDataList,
          ),
        "calling service to assign permissions to role in bulk",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permissions assigned to role successfully",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac-system/permissions/:permissionId
   * Removes a permission from a role.
   *
   * @route DELETE /api/rbac-system/permissions/:permissionId
   * @param roleId - The ID of the role
   * @param permissionId - The ID of the permission to remove
   * @returns JSON response confirming removal
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  removeFromRole: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roles.remove.DELETE,
    async ({ input, output }) => {
      const permissionId = input.body.permissionId;

      const { error } = await tryCatch(
        async () =>
          await this.permissionService.removePermissionFromRole(permissionId),
        "calling service to remove permission from role",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permission removed from role successfully",
      });
    },
  );

  /**
   * DELETE /api/rbac-system/permissions/:roleId/bulk/remove
   * Removes multiple permissions from a role in bulk.
   *
   * @route DELETE /api/rbac-system/permissions/:roleId/bulk/remove
   * @param roleId - The ID of the role
   * @body permissionIds - Array of permission IDs to remove
   * @returns JSON response confirming removal
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error
   */
  removeFromRoleInBulk: RequestHandler = createExpressController(
    contract.api.rbac_system.permissions.roles.bulk_remove.DELETE,
    async ({ input, output }) => {
      const permissionIds = input.body.permissionIds;

      const { error } = await tryCatch(
        async () =>
          await this.permissionService.removePermissionsFromRoleInBulk(
            permissionIds,
          ),
        "calling service to remove permissions from role in bulk",
      );

      if (error) throw new ServiceError_DEPRECATED(error.message);

      return output(200, {
        status: "success",
        message: "Permissions removed from role successfully",
      });
    },
  );
}

export const permissionControllerInstance = new PermissionController();
