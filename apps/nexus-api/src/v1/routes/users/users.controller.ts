import { FilesModuleController } from "@/v1/modules/filesModule";
import { RbacModuleController } from "@/v1/modules/rbacSystem/RbacModuleController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class UsersHttpController {
  constructor(private rbacModule: RbacModuleController) {}

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
    contract.api.v1.users.userId.roles.roleId.DELETE,
    async ({ input, output, ctx }) => {
      const { req } = ctx; 
      const result = await this.rbacModule.removeRoleFromUser(
        input.params.userId,
        input.params.roleId,
      );
      return output(200, {
        status: "success",
        message: "Role unassigned successfully",
        data: true,
      });
    }
  )
}
