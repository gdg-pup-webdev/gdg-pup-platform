import { RequestHandler, Router } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { memberProjectsController as moduleController } from "@/v1/modules/memberProjects";

export class MemberProjectsController {
  constructor(private readonly module: typeof moduleController) {}

  postCreate: RequestHandler = createExpressController(
    contract.api.v1.member_projects.POST,
    async ({ input, output }) => {
      const { mainImage, secondaryImage, tertiaryImage } = input.files;

      const result = await this.module.create({
        ...input.body.data,
        mainImage: mainImage ? {
          buffer: await mainImage.arrayBuffer(),
          name: mainImage.name,
          type: mainImage.type,
        } : undefined,
        secondaryImage: secondaryImage ? {
          buffer: await secondaryImage.arrayBuffer(),
          name: secondaryImage.name,
          type: secondaryImage.type,
        } : undefined,
        tertiaryImage: tertiaryImage ? {
          buffer: await tertiaryImage.arrayBuffer(),
          name: tertiaryImage.name,
          type: tertiaryImage.type,
        } : undefined,
      });

      return output(201, {
        status: "success",
        message: "Member project created successfully",
        data: result,
      });
    },
  );

  getList: RequestHandler = createExpressController(
    contract.api.v1.member_projects.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.module.list(pageNumber, pageSize);

      return output(200, {
        status: "success",
        message: "Member projects fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.GET,
    async ({ input, output }) => {
      const result = await this.module.getOne(input.params.id);
      return output(200, {
        status: "success",
        message: "Member project fetched successfully",
        data: result,
      });
    },
  );

  patchUpdate: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.PATCH,
    async ({ input, output }) => {
      const { mainImage, secondaryImage, tertiaryImage } = input.files;

      const result = await this.module.update({
        id: input.params.id,
        ...input.body.data,
        mainImage: mainImage ? {
          buffer: await mainImage.arrayBuffer(),
          name: mainImage.name,
          type: mainImage.type,
        } : undefined,
        secondaryImage: secondaryImage ? {
          buffer: await secondaryImage.arrayBuffer(),
          name: secondaryImage.name,
          type: secondaryImage.type,
        } : undefined,
        tertiaryImage: tertiaryImage ? {
          buffer: await tertiaryImage.arrayBuffer(),
          name: tertiaryImage.name,
          type: tertiaryImage.type,
        } : undefined,
      });

      return output(200, {
        status: "success",
        message: "Member project updated successfully",
        data: result,
      });
    },
  );

  deleteDelete: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.DELETE,
    async ({ input, output }) => {
      await this.module.delete(input.params.id);
      return output(200, {
        status: "success",
        message: "Member project deleted successfully",
      });
    },
  );

  getByMember: RequestHandler = createExpressController(
    contract.api.v1.member_projects.member.memberGdgId.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.module.getByMember(
        input.params.memberGdgId,
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Member projects fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );
}

export class MemberProjectsRouter {
  router: Router;

  constructor(private readonly controller: MemberProjectsController) {
    this.router = Router();

    this.router.post("/", this.controller.postCreate);
    this.router.get("/", this.controller.getList);
    this.router.get("/:id", this.controller.getOne);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteDelete);
    this.router.get("/member/:memberGdgId", this.controller.getByMember);
  }
}
