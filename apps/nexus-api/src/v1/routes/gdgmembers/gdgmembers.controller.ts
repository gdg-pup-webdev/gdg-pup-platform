import { gdgMembersController, GdgMembersController } from "@/v1/modules/gdgMembers";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class GdgMembersHttpController {
  constructor(
    private readonly moduleController: GdgMembersController = gdgMembersController
  ) {}

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
    }
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
    }
  );

  getIdGet: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.findByGdgId(input.params.gdgId);
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
    }
  );

  getIdPatch: RequestHandler = createExpressController(
    contract.api.v1.gdgmembers.gdgId.PATCH,
    async ({ input, output }) => {
      const result = await this.moduleController.update(input.params.gdgId, input.body.data);
      return output(200, {
        status: "success",
        message: "GDG member updated successfully",
        data: result,
      });
    }
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
    }
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
    }
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
    }
  );
 
}
