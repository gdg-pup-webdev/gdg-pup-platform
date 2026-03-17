import { FilesModuleController } from "@/v1/modules/filesModule";
import { RbacModuleController } from "@/v1/modules/rbacSystem/RbacModuleController";
import { userModuleController, UserModuleController } from "@/v1/modules/UserModule";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

function toContractUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    gdg_id: "", // Missing in UserModuleController DTO but required by contract
    display_name: user.username,
    first_name: null,
    last_name: null,
    avatar_url: null,
    status: "active",
    created_at: user.createdAt,
    updated_at: user.createdAt,
  };
}

export class UsersHttpController {
  constructor(
    private rbacModule: RbacModuleController,
    private userModule: UserModuleController = userModuleController
  ) {}

  listUsers: RequestHandler = createExpressController(
    contract.api.v1.users.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const result = await this.userModule.listUsers(pageNumber, pageSize);

      if (result.error) {
        return output(500, {
          status: "error",
          message: result.error,
        });
      }

      return output(200, {
        status: "success",
        message: "Users fetched successfully",
        data: result.list!.map(toContractUser),
        meta: {
          pageNumber,
          pageSize,
          totalRecords: result.count!,
          totalPages: Math.ceil(result.count! / pageSize),
        },
      });
    }
  );

  getUser: RequestHandler = createExpressController(
    contract.api.v1.users.userId.GET,
    async ({ input, output }) => {
      const result = await this.userModule.getUser(input.params.userId);

      if (result.error) {
        return output(404, {
          status: "error",
          message: result.error,
        });
      }

      return output(200, {
        status: "success",
        message: "User fetched successfully",
        data: toContractUser(result.data),
      });
    },
  );

  listRoles: RequestHandler = createExpressController(
    contract.api.v1.users.userId.roles.GET,
    async ({ input, output, ctx }) => {
      const rolesAndPermissions =
        await this.rbacModule.getRolesAndPermissionsOfUser(
          input.params.userId!,
        );

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: rolesAndPermissions,
      });
    },
  );

  assignRole: RequestHandler = createExpressController(
    contract.api.v1.users.userId.roles.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx; 
      const result = await this.rbacModule.assignRoleToUser(
        input.params.userId,
        input.body.data.roleName,
      );
      return output(200, {
        status: "success",
        message: "Role connected successfully",
        data: true,
      });
    },
  );

  unassignRole : RequestHandler = createExpressController(
    contract.api.v1.users.userId.roles.roleName.DELETE,
    async ({ input, output, ctx }) => {
      const { req } = ctx; 
      const result = await this.rbacModule.removeRoleFromUser(
        input.params.userId,
        input.params.roleName,
      );
      return output(200, {
        status: "success",
        message: "Role unassigned successfully",
        data: true,
      });
    }
  )
}
