import {
  ControllerError,
  DatabaseError,
  NotFoundError,
  RepositoryError,
  ServiceError,
} from "@/classes/ServerError";
import {
  RoleService,
  roleServiceInstance,
  RoleListFilters,
} from "./role.service.js";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * RoleController
 * ==============
 *
 * Controller for handling role-related HTTP requests.
 * Implements endpoints defined in the RBAC system contract.
 *
 * Key Endpoints:
 * - GET /api/rbac-system/roles - List all roles (with optional userId filter)
 * - GET /api/rbac-system/roles/:roleId - Get single role by ID
 * - GET /api/rbac-system/roles/all-users - Get all users with their roles
 * - POST /api/rbac-system/roles - Create a new role
 * - PATCH /api/rbac-system/roles/:roleId - Update an existing role
 * - DELETE /api/rbac-system/roles/:roleId - Delete a role
 * - POST /api/rbac-system/roles/:roleId/users/:userId - Assign role to user
 * - DELETE /api/rbac-system/roles/:roleId/users/:userId - Remove role from user
 */
export class RoleController {
  constructor(
    private readonly roleService: RoleService = roleServiceInstance,
  ) {}

  /**
   * GET /api/rbac-system/roles?userId={userId}&pageNumber={n}&pageSize={n}
   * Lists roles with optional filtering by userId and pagination.
   *
   * @route GET /api/rbac-system/roles
   * @query userId - Optional filter to get roles for a specific user
   * @query pageNumber - Current page (1-indexed)
   * @query pageSize - Number of items per page
   * @returns JSON response containing the list of roles and pagination metadata
   * @throws {ServiceError} If the service layer encounters an error
   */
  listRoles: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, userId = null } = input.query;

      const { data, error } = await tryCatch(
        async () =>
          await this.roleService.listRolesWithFilters(pageNumber, pageSize, {
            userId,
          }),
        "calling service to list roles",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / pageSize),
          currentPage: pageNumber,
          pageSize: pageSize,
        },
      });
    },
  );

  /**
   * GET /api/rbac-system/roles/users?pageNumber={n}&pageSize={n}&withoutRoles={true}
   * Lists all users with their assigned roles (paginated).
   * Can filter to show only users without any roles.
   *
   * @route GET /api/rbac-system/roles/users
   * @query pageNumber - Current page (1-indexed)
   * @query pageSize - Number of items per page
   * @query withoutRoles - Optional: If true, returns only users without any roles
   * @returns JSON response containing grouped user-role data
   * @throws {ServiceError} If the service layer encounters an error
   */
  listUsersWithRoles: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.users.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, roleId, withoutRoles } = input.query;

      const { data, error } = await tryCatch(
        async () =>
          await this.roleService.listUsersWithRoles(pageNumber, pageSize, {
            roleId: roleId || undefined,
            withoutRoles: withoutRoles || false,
          }),
        "calling service to list users with roles",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Users with roles fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          totalPages: Math.ceil(data.count / pageSize),
          currentPage: pageNumber,
          pageSize: pageSize,
        },
      });
    },
  );

  /**
   * GET /api/rbac-system/roles/:roleId
   * Retrieves a single role by its ID.
   *
   * @route GET /api/rbac-system/roles/:roleId
   * @param roleId - The ID of the role to retrieve
   * @returns JSON response containing the role data
   * @throws {NotFoundError} If the role does not exist
   * @throws {ServiceError} If the service layer encounters an error
   */
  getRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.GET,
    async ({ input, output }) => {
      const { roleId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.getRole(roleId),
        "calling service to get role",
      );

      if (error) throw new ServiceError(error.message);

      if (!data) {
        return output(404, {
          status: "fail",
          message: `Role with ID "${roleId}" not found`,
        });
      }

      return output(200, {
        status: "success",
        message: "Role fetched successfully",
        data,
      });
    },
  );

  /**
   * POST /api/rbac-system/roles
   * Creates a new role.
   *
   * @route POST /api/rbac-system/roles
   * @body data - Role data (role_name, description)
   * @returns JSON response containing the created role
   * @throws {RepositoryError} If role name already exists
   * @throws {ServiceError} If the service layer encounters an error
   */
  createRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.POST,
    async ({ input, output }) => {
      const roleData = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.roleService.createRole(roleData),
        "calling service to create role",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: `Role "${roleData.role_name}" created successfully`,
        data,
      });
    },
  );

  /**
   * PATCH /api/rbac-system/roles/:roleId
   * Updates an existing role.
   *
   * @route PATCH /api/rbac-system/roles/:roleId
   * @param roleId - The ID of the role to update
   * @body data - Partial role data to update
   * @returns JSON response containing the updated role
   * @throws {NotFoundError} If the role does not exist
   * @throws {ServiceError} If the service layer encounters an error
   */
  updateRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const updates = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.roleService.updateRole(roleId, updates),
        "calling service to update role",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Role updated successfully",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac-system/roles/:roleId
   * Deletes a role.
   *
   * @route DELETE /api/rbac-system/roles/:roleId
   * @param roleId - The ID of the role to delete
   * @returns JSON response confirming deletion
   * @throws {RepositoryError} If role is still assigned to users
   * @throws {NotFoundError} If the role does not exist
   * @throws {ServiceError} If the service layer encounters an error
   */
  deleteRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.DELETE,
    async ({ input, output }) => {
      const { roleId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.deleteRole(roleId),
        "calling service to delete role",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Role deleted successfully",
      });
    },
  );

  /**
   * POST /api/rbac-system/roles/:roleId/users/:userId
   * Assigns a role to a user.
   *
   * @route POST /api/rbac-system/roles/:roleId/users/:userId
   * @param roleId - The ID of the role to assign
   * @param userId - The ID of the user to receive the role
   * @returns JSON response containing the assignment data
   * @throws {NotFoundError} If role or user does not exist
   * @throws {RepositoryError} If user already has the role
   * @throws {ServiceError} If the service layer encounters an error
   */
  assignRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.users.POST,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const userId = input.body.userId;

      const { data, error } = await tryCatch(
        async () => await this.roleService.assignRole(userId, roleId),
        "calling service to assign role",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Role assigned to user successfully",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac-system/roles/:roleId/users/:userId
   * Removes a role from a user.
   *
   * @route DELETE /api/rbac-system/roles/:roleId/users/:userId
   * @param roleId - The ID of the role to remove
   * @param userId - The ID of the user to remove the role from
   * @returns JSON response confirming removal
   * @throws {ServiceError} If the service layer encounters an error
   */
  removeRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.users.DELETE,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const userId = input.body.userId;

      const { error } = await tryCatch(
        async () => await this.roleService.removeRole(userId, roleId),
        "calling service to remove role",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Role removed from user successfully",
      });
    },
  );
}

export const roleControllerInstance = new RoleController();
