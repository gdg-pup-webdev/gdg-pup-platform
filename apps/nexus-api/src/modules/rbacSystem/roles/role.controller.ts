import { tryCatch } from "@/utils/tryCatch.util.js";
import { RoleService, roleServiceInstance } from "./role.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";
import { BadRequestError } from "@/errors/HttpError.js";

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
   */
  listRoles: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, userId, resourceName, actionName } =
        input.query;

      const data = await this.roleService.listRoles(pageNumber, pageSize, {
        userId,
        resource: resourceName,
        action: actionName,
      });

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: data.list.map((role) => {
          const { user_role_permission, ...rest } = role;
          return {
            ...rest,
            permissions: user_role_permission.map((permission) => {
              return {
                resource_name: permission.resource,
                action: permission.action,
              };
            }),
          };
        }),
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
   * POST /api/rbac-system/roles
   * Creates a new role.
   */
  createOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.POST,
    async ({ input, output }) => {
      const roleData = input.body.data;

      const data = await this.roleService.createOneRole(roleData);

      console.log("create one role controller hey", data);

      return output(200, {
        status: "success",
        message: `Role created successfully`,
        data: data,
      });
    },
  );

  assignOneRoleToManyUsers: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.assign_to_users.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const { userIds } = input.body.data;

      await this.roleService.assignOneRoleToManyUsers(roleId, userIds);

      return output(200, {
        status: "success",
        message: `Roles assigned to user successfully`,
      });
    },
  );

  attachManyPermissionsToOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.attach_permissions.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const permissions = input.body.data;

      const data = await this.roleService.attachManyPermissionsToOneRole(
        roleId,
        permissions.map((permission) => ({
          resource: permission.resource_name,
          action: permission.action,
        })),
      );

      return output(200, {
        status: "success",
        message: `Permissions attached to role successfully`,
        data: data.map((role) => {
          return {
            resource_name: role.resource,
            action: role.action,
          };
        }),
      });
    },
  );

  deleteOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.DELETE,
    async ({ input, output }) => {
      const { roleId } = input.params;

      await this.roleService.deleteOneRole(roleId);

      return output(200, {
        status: "success",
        message: `Role deleted successfully`,
      });
    },
  );

  getOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.GET,
    async ({ input, output }) => {
      const { roleId } = input.params;

      const data = await this.roleService.getOneRole(roleId);

      return output(200, {
        status: "success",
        message: "Role fetched successfully",
        data: {
          id: data.id,
          name: data.name,
          description: data.description,
          permissions: data.user_role_permission.map((permission) => {
            return {
              resource_name: permission.resource,
              action: permission.action,
            };
          }),
        },
      });
    },
  );

  updateOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const updates = input.body.data;

      const data = await this.roleService.updateOneRole(roleId, updates);

      return output(200, {
        status: "success",
        message: "Role updated successfully",
        data,
      });
    },
  );

  detachManyPermissionsFromOneRole: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.detach_permissions.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const permissions = input.body.data;

      const data = await this.roleService.detachManyPermissionsFromOneRole(
        roleId,
        permissions.map((permission) => ({
          resource: permission.resource_name,
          action: permission.action,
        })),
      );

      return output(200, {
        status: "success",
        message: `Permissions detached from role successfully`,
        data: data.map((role) => {
          return {
            resource_name: role.resource,
            action: role.action,
          };
        }),
      });
    },
  );

  removeOneRoleFromOneUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.remove_from_user.PATCH,
    async ({ input, output }) => {
      const { roleId } = input.params;
      const { userId } = input.body.data;

      const data = await this.roleService.removeOneRoleFromOneUser(
        userId,
        roleId,
      );

      return output(200, {
        status: "success",
        message: `Roles removed from user successfully`,
        data: data.map((role) => {
          return {
            id: role.id,
            name: role.name,
            description: role.description,
          };
        }),
      });
    },
  );
}

export const roleControllerInstance = new RoleController();
