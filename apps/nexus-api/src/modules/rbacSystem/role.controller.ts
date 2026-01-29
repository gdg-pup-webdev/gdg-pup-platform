import { ServiceError } from "@/classes/ServerError";
import {
  RoleService,
  roleServiceInstance,
} from "@/modules/rbacSystem/role.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class RoleController {
  constructor(private roleService: RoleService = roleServiceInstance) {}

  /**
   * Get all roles of all users
   */
  getAllRolesOfAllUsers: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.all_users.GET,
    async ({ output }) => {
      const { data, error } = await tryCatch(
        async () => await this.roleService.getAllRolesOfAllUsers(),
        "getting all roles for all users",
      );

      if (error) throw error;

      return output(200, {
        status: "success",
        message: "Fetched all roles of all users",
        data,
      });
    },
  );

  /**
   * GET /api/rbac/roles?userId={userId}&pageNumber={n}&pageSize={n}
   * Get roles of a specific user OR all roles if no userId
   */
  getRolesOrUser: RequestHandler = createExpressController(
    contract.api.rbac_system.roles.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const userId = input.query.userId;

      // Pag may userId, kukunin yung role ng userId na yun
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
      }

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

      if (error) throw error;

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

      const { error } = await tryCatch(
        async () => await this.roleService.deleteRole(roleId),
        "deleting role",
      );

      if (error) throw error;

      return output(200, {
        status: "success",
        message: "Role deleted successfully",
      });
    },
  );

  /**
   * Checks if the role is already assign
   */

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

      if (error) throw error;

      return output(200, {
        status: "success",
        message: "Role to assigned to user successfully",
        data,
      });
    },
  );

  /**
   * GET /api/rbac/roles/:roleId/users/:userId
   * Checks if the user has specified role
   */
  // doUserHasThisRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles.roleId.users.userId.GET,
  //   async ({ input, output }) => {
  //     const { roleId, userId } = input.params;

  //     const { data, error } = await tryCatch(
  //       async () => await this.roleService.doUserHasThisRole(userId, roleId),
  //       "checking if user has the input role",
  //     );

  //     if (error) throw error;

  //     return output(200, {
  //       status: "success",
  //       message: "",
  //       data,
  //     })
  //   }
  // )
}

export const roleControllerInstance = new RoleController();
