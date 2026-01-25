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
    contract.api.rbac_system.roles["roleId"].GET,
    async ({ input, output }) => {
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
  // updateRole: RequestHandler = createExpressController(
  //   contract.api.rbac_system.roles["roleId"].PATCH,
  //   async ({ input, output }) => {
  //     const roleId = input.params.roleId;
  //     const updates = input.params
  //   }
  // )
}

export const roleControllerInstance = new RoleController();
