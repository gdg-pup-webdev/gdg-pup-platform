 import { FilesModuleController } from "@/v1/modules/filesModule";
import { RbacModuleController } from "@/v1/modules/rbacSystem/RbacModuleController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";  
export class RolesHttpController {
  constructor(private rbacController :RbacModuleController) {}

  getOne : RequestHandler = createExpressController(
    contract.api.v1.roles.roleName.GET, 
    async ({ input, output, ctx }) => {
      const { req } = ctx; 
      const data = await this.rbacController.getRole(input.params.roleName);
      return output(200, {
        status: "success",
        message: "Role fetched successfully",
        data: data,
      });
    }
  )

  listRoles : RequestHandler = createExpressController(
    contract.api.v1.roles.GET, 
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const { list, count } = await this.rbacController.listRoles(
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    }
  )

  createRole : RequestHandler = createExpressController(
    contract.api.v1.roles.POST, 
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const data = await this.rbacController.createRole(input.body.data.name, input.body.data.description);
      return output(200, {
        status: "success",
        message: "Role created successfully",
        data: data,
      });
    }
  )

  deleteRole : RequestHandler = createExpressController(
    contract.api.v1.roles.roleName.DELETE, 
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const data = await this.rbacController.deleteRole(input.params.roleName);
      return output(200, {
        status: "success",
        message: "Role deleted successfully",
        data: data,
      });
    }
  )

  addPermission : RequestHandler = createExpressController(
    contract.api.v1.roles.roleName.permissions.POST, 
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const data = await this.rbacController.attachPermissionToRole(
        input.params.roleName,
        input.body.data.resource_name, input.body.data.action)
      return output(200, {
        status: "success",
        message: "Permissions added successfully",
        data: {
          ...data, 
          role_id: data.id, 
          resource_name: input.body.data.resource_name, 
          action: input.body.data.action
        },
      });
    }
  ) 
 
  deletePermission : RequestHandler = createExpressController(
    contract.api.v1.roles.roleName.permissions.PATCH, 
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const user = req.user!;
      const data = await this.rbacController.removePermissionFromRole(
        input.params.roleName,
        input.body.data.resource, 
        input.body.data.action)

      return output(200, {
        status: "success",
        message: "Permissions deleted successfully",
        data: true,
      });
    }
  ) 

}
