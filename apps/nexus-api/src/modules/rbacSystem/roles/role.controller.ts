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

      if (error) throw error;

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
    },
  );
}

export const roleControllerInstance = new RoleController();
