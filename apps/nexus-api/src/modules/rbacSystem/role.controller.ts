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

  getRolesOrUser: RequestHandler = createExpressController(
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
