import {
  gdgMembersController,
  GdgMembersController,
} from "@/v1/modules/members";
import { rbacController } from "@/v1/modules/rbacSystem";
import { RbacModuleController } from "@/v1/modules/rbacSystem/RbacModuleController";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgMembersHttpController {
  constructor(
    private readonly moduleController: GdgMembersController = gdgMembersController,
    private readonly rbaccontroller: RbacModuleController = rbacController,
  ) {}

  listRolesOfUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.GET,
    async ({ input, output }) => {
      const result = await this.rbaccontroller.getRolesAndPermissionsOfUser(
        input.params.gdgId,
      );

      const roles = result.map((role) => role.name);

      return output(200, {
        status: "success",
        message: "Roles fetched successfully",
        data: result,
        meta: {
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
          totalRecords: roles.length,
          totalPages: Math.ceil(roles.length / input.query.pageSize),
        },
      });
    },
  );

  addRoleToUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.POST,
    async ({ input, output }) => {
      const result = await this.rbaccontroller.assignRoleToUser(
        input.params.gdgId,
        input.body.data.roleName,
      );

      return output(200, {
        status: "success",
        message: "Role added to user successfully",
        data: true,
      });
    },
  );

  deleteRoleFromUser: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.roles.roleName.DELETE,
    async ({ input, output }) => {
      await this.rbaccontroller.removeRoleFromUser(
        input.params.gdgId,
        input.params.roleName,
      );

      return output(200, {
        status: "success",
        message: "Role removed from user successfully",
      });
    },
  );

  changeProfileImage: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.profile_image.POST,
    async ({ input, output }) => {
      const file = input.files?.newProfile;
      if (!file) {
        return output(400, {
          status: "fail",
          message: "No file uploaded",
        });
      }

      const result = await this.moduleController.changeProfilePicture(
        input.params.gdgId,
        file,
      );
      return output(200, {
        status: "success",
        message: "Profile picture updated successfully",
        data: result,
      });
    },
  );

  getIdSimilarUsers: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.similar_users.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.getSimilarUsers(
        input.params.gdgId,
        input.query.pageNumber,
        input.query.pageSize,
        input.query.strategy,
      );

      return output(200, {
        status: "success",
        message: "Similar GDG members fetched successfully",
        data: result.list,
        meta: {
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
          totalRecords: result.count,
          totalPages: Math.ceil(result.count / input.query.pageSize),
        },
      });
    },
  );

  get: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.GET,
    async ({ input, output }) => {
      const { pageNumber, pageSize, search, program, department } = input.query;
      const result = await this.moduleController.list(pageNumber, pageSize, {
        search,
        program,
        department,
      });

      return output(200, {
        status: "success",
        message: "GDG members fetched successfully",
        data: result.list,
        meta: {
          currentPage: pageNumber,
          pageSize,
          totalRecords: result.count,
          totalPages: Math.ceil(result.count / pageSize),
        },
      });
    },
  );

  post: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.POST,
    async ({ input, output }) => {
      const result = await this.moduleController.addMember(input.body.data);
      return output(201, {
        status: "success",
        message: "GDG member added successfully",
        data: result,
      });
    },
  );

  getIdGet: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.findByGdgId(
        input.params.gdgId,
      );
      if (!result) {
        return output(404, {
          status: "fail",
          message: "GDG member not found",
        });
      }
      return output(200, {
        status: "success",
        message: "GDG member fetched successfully",
        data: result,
      });
    },
  );

  getIdPatch: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.PATCH,
    async ({ input, output }) => {
      const result = await this.moduleController.update(
        input.params.gdgId,
        input.body.data,
      );
      return output(200, {
        status: "success",
        message: "GDG member updated successfully",
        data: result,
      });
    },
  );

  getIdDelete: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.DELETE,
    async ({ input, output }) => {
      await this.moduleController.delete(input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member deleted successfully",
        data: true,
      });
    },
  );

  getIdMakePrivatePost: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.make_private.POST,
    async ({ input, output }) => {
      await this.moduleController.makeProfilePrivate(input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member profile made private",
        data: true,
      });
    },
  );

  getIdMakePublicPost: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.make_public.POST,
    async ({ input, output }) => {
      await this.moduleController.makeProfilePublic(input.params.gdgId);
      return output(200, {
        status: "success",
        message: "GDG member profile made public",
        data: true,
      });
    },
  );
}
