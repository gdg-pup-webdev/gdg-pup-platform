import { ServiceError } from "@/classes/ServerError";
import { RoleService, roleServiceInstance } from "./role.service.js";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

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

      if (error) throw new ServiceError(error.message);

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
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const userId = input.query.userId;

      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.roleService.getRolesOfUser(userId),
          "getting user roles",
        );
        if (error) throw new ServiceError(error.message);

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
      } else {
        // Pero kapag wala namang userId, kukunin yung mga roles
        const { data, error } = await tryCatch(
          async () => this.roleService.getAllRoles(),
          "getting all roles",
        );

        if (error) throw new ServiceError(error.message);

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
      }
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

      if (error) throw new ServiceError(error.message);

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

      if (error) throw new ServiceError(error.message);

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

      if (error) throw new ServiceError(error.message);

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

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Role to assigned to user successfully",
        data,
      });
    },
  );

  /**
   * POST /api/rbac/roles/:roleId/bulk/assign
   * Assigns role to multiple users
   */
  assignRoleToUsers: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.bulk.assign.POST,
    async ({ input, output }) => {
      const roleId = input.params.roleId;
      const { userIds } = input.body;

      const { data, error } = await tryCatch(
        async () => await this.roleService.assignRoleToUsers(userIds, roleId),
        "Assigning role to multiple users",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "Success",
        message: "Successfully assigned role to multiple users",
        data,
      });
    },
  );

  /**
   * POST /api/rbac/roles/users/:userId/bulk/assign
   * Assigns multiple Roles to a user
   */
  assignRolesToUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.users.userId.bulk.assign.POST,
    async ({ input, output }) => {
      const { roleIds } = input.body;
      const userId = input.params.userId;

      const { data, error } = await tryCatch(
        async () => this.roleService.assignRolesToUser(userId, roleIds),
        "Assigning multiple roles to user",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Successfully assigned roles to the user",
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

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Successfylly removed the role from a user",
        data: data.success,
      });
    },
  );

  /**
   * DELETE /api/rbac/roles/:roleId/bulk/remove
   * Remove role from multiple users
   */
  removeRoleFromUsers: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.roleId.bulk.remove.DELETE,
    async ({ input, output }) => {
      const { userIds } = input.body;
      const roleId = input.params.roleId;

      const { data, error } = await tryCatch(
        async () => await this.roleService.removeRoleFromUsers(userIds, roleId),
        "Removing role from users",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Successfully removed the role from multiple users",
        data: data.success,
      });
    },
  );

  /**
   * DELETE /api/rbac/roles/users/:userId/bulk/remove
   * Remove multiple roles from a user
   */
  removeRolesFromUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.users.userId.bulk.remove.DELETE,
    async ({ input, output }) => {
      const { userId } = input.params;
      const roleIds = input.body.roleIds;

      const { data, error } = await tryCatch(
        async () => await this.roleService.removeRolesFromUser(userId, roleIds),
        "Removing roles from a user",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Successfully removed multiple roles from a user",
        data: data.success,
      });
    },
  );
}

export const roleControllerInstance = new RoleController();
