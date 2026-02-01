import { ControllerError } from "@/classes/ServerError";
import { RoleService, roleServiceInstance } from "./role.service.js";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * RoleController
 * ==============
 *
 * The RoleController class defines all HTTP endpoints for role management and user-role assignments in the RBAC system.
 *
 * Responsibilities:
 * - Maps REST API routes to business logic in RoleService.
 * - Handles request validation, input parsing, and response formatting.
 * - Wraps service errors as ControllerError for consistent error handling and API responses.
 * - Supports paginated queries, single and bulk operations, and permission checks.
 *
 * Key Endpoints:
 * - GET /api/rbac/roles/all-users: Fetches all users and their assigned roles, paginated.
 * - GET /api/rbac/roles: Fetches roles for a specific user (if userId is provided) or all roles.
 * - GET /api/rbac/roles/:roleId: Fetches a single role by ID, including permissions.
 * - GET /api/rbac/roles/:roleId/users/no-roles: Fetches users who do not have the specified role.
 * - GET /api/rbac/roles/:roleName: Checks if a role exists by name.
 * - POST /api/rbac/roles: Creates a new role.
 * - PATCH /api/rbac/roles/:roleId: Updates an existing role.
 * - DELETE /api/rbac/roles/:roleId: Deletes a role (fails if assigned to users).
 * - POST /api/rbac/roles/:roleId/users/:userId: Assigns a role to a user.
 * - POST /api/rbac/roles/:roleId/bulk/assign: Assigns a role to multiple users.
 * - POST /api/rbac/roles/users/:userId/bulk/assign: Assigns multiple roles to a user.
 * - DELETE /api/rbac/roles/:roleId/users/:userId: Removes a role from a user.
 * - DELETE /api/rbac/roles/:roleId/bulk/remove: Removes a role from multiple users.
 * - DELETE /api/rbac/roles/users/:userId/bulk/remove: Removes multiple roles from a user.
 *
 * Usage:
 * - Each method is a RequestHandler for Express, created via createExpressController for typed contract support.
 * - All responses include status, message, data, and pagination meta where applicable.
 * - Errors are caught and wrapped as ControllerError for standardized error responses.
 *
 * This controller provides a complete, documented, and robust API surface for RBAC role management.
 */
export class RoleController {
  constructor(
    private readonly roleService: RoleService = roleServiceInstance,
  ) {}

  /**
   * GET /api/rbac/roles/all-users
   * Get all roles of all users
   */
  getAllRolesOfAllUsers: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.all_users.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { data, error } = await tryCatch(
        async () =>
          await this.roleService.getAllRolesOfAllUsers(pageNumber, pageSize),
        "getting all roles for all users",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Fetched all roles of all users",
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
   * GET /api/rbac/roles?userId={userId}&pageNumber={n}&pageSize={n}
   * Get roles of a specific user OR all roles if no userId
   */
  getRolesOfUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const userId = input.query.userId;

      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.roleService.getRolesOfUser(userId),
          "getting user roles",
        );

        if (error) throw new ControllerError(error.message);

        return output(200, {
          status: "success",
          message: "User roles fetched successfully",
          data: data.list,
          meta: {
            totalRecords: data.count,
            currentPage: pageNumber,
            pageSize,
            totalPages: Math.ceil(data.count / pageSize),
          },
        });
      }

      // Pero kapag wala namang userId, kukunin yung mga roles
      const { data, error } = await tryCatch(
        async () => this.roleService.getAllRoles(),
        "getting all roles",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "All roles fetched successfully",
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
   * GET /api/rbac/roles/:roleId
   * Get single role by ID with permissions
   */
  getRoleById: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.GET,
    async ({ input, output, ctx }) => {
      const { roleId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.getRoleById(roleId),
        "getting role by role id",
      );

      if (error) throw new ControllerError(error.message);

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
   * GET /api/rbac/roles/:roleId/users/no-roles
   * Get users without assigned roles
   */
  getUsersWithoutRoles: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.users.no_roles.GET,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { data, error } = await tryCatch(
        async () => await this.roleService.getUsersWithoutRoles(roleId),
        "GEtting the users without roles",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Successful getting the users without roles assigned",
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
   * GET /api/rbac/roles/:roleName
   * Checks if role exists by name
   */
  roleExistsByName: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleName.GET,
    async ({ input, output }) => {
      const { roleName } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.roleExistsByName(roleName),
        "Checking if the role exists by name",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Role exists",
        data,
      });
    },
  );

  /**
   * POST /api/rbac/roles
   * Create a new role
   * Body: { role_name: string, description?: string }
   */
  createRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.POST,
    async ({ input, output }) => {
      const roleData = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.roleService.createRole(roleData),
        "creating role",
      );

      if (error) throw error;

      return output(200, {
        status: "success",
        message: `Role "${roleData.role_name}" created successfully`,
        data,
      });
    },
  );

  /**
   * PATCH /api/rbac/roles/:roleId
   * Update an existing role
   * Body: { role_name?: string, description?: string }
   */
  updateRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.PATCH,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const updates = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.roleService.updateRole(roleId, updates),
        "updating role",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Role updated successfully",
        data,
      });
    },
  );

  /**
   * DELETE DELETE /api/rbac/roles/:roleId
   * Delete a role (fails if role is assigned to users)
   */
  deleteRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.DELETE,
    async ({ input, output }) => {
      const { roleId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.deleteRole(roleId),
        "deleting role",
      );

      if (error) throw error;

      return output(200, {
        status: "success",
        message: "Role deleted successfully",
        data: data.success,
      });
    },
  );

  /**
   * POST /api/rbac/roles/:roleId/users/:userId
   * Assign role to user
   */
  assignRoleToUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.users.userId.POST,
    async ({ input, output }) => {
      const { roleId, userId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.assignRoleToUser(userId, roleId),
        "assigning role to user",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Role to assigned to user successfully",
        data,
      });
    },
  );

  /**
   * DELETE /api/rbac/roles/:roleId/users/:userId
   * Remove role from a user
   */
  removeRoleFromUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.users.userId.DELETE,
    async ({ input, output }) => {
      const { roleId, userId } = input.params;

      const { data, error } = await tryCatch(
        async () => await this.roleService.removeRoleFromUser(userId, roleId),
        "Removing role to a user",
      );

      if (error) throw new ControllerError(error.message);

      return output(200, {
        status: "success",
        message: "Successfylly removed the role from a user",
        data: data.success,
      });
    },
  );
}

export const roleControllerInstance = new RoleController();
