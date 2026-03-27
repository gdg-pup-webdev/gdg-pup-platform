import { RequestHandler, Router } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { MemberShowcaseController as MemberShowcaseModuleController } from "@/v1/modules/MemberShowcase";

export class MemberShowcaseHttpController {
  constructor(private readonly moduleController: MemberShowcaseModuleController) {}

  postCreate: RequestHandler = createExpressController(
    contract.api.v1.member_showcase.POST,
    async ({ input, output }) => {
      const thumbnailFile = input.files.thumbnailFile;

      if (!thumbnailFile) {
        throw new Error("Thumbnail file is required");
      }
      
      const result = await this.moduleController.create({
        title: input.body.data.title,
        description: input.body.data.description,
        date: new Date(input.body.data.date),
        articleUrl: input.body.data.articleUrl,
        showcasedMembers: input.body.data.showcasedMembers,
        thumbnailFile: {
          buffer: await thumbnailFile.arrayBuffer(),
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        },
      });

      return output(201, {
        status: "success",
        message: "Member Showcase created successfully",
        data: result,
      });
    },
  );

  getList: RequestHandler = createExpressController(
    contract.api.v1.member_showcase.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      
      const { list, count } = await this.moduleController.list(pageNumber, pageSize);

      return output(200, {
        status: "success",
        message: "Member Showcases fetched successfully",
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
    contract.api.v1.member_showcase.id.GET,
    async ({ input, output }) => {
      const result = await this.moduleController.getOne(input.params.id);
      return output(200, {
        status: "success",
        message: "Member Showcase fetched successfully",
        data: result,
      });
    },
  );

  patchUpdate: RequestHandler = createExpressController(
    contract.api.v1.member_showcase.id.PATCH,
    async ({ input, output }) => {
      const thumbnailFile = input.files.thumbnailFile;
      
      const result = await this.moduleController.update(input.params.id, {
        title: input.body.data.title,
        description: input.body.data.description,
        date: input.body.data.date ? new Date(input.body.data.date) : undefined,
        articleUrl: input.body.data.articleUrl,
        showcasedMembers: input.body.data.showcasedMembers,
        thumbnailFile: thumbnailFile ? {
          buffer: thumbnailFile.buffer,
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        } : undefined,
      });

      return output(200, {
        status: "success",
        message: "Member Showcase updated successfully",
        data: result,
      });
    },
  );

  deleteDelete: RequestHandler = createExpressController(
    contract.api.v1.member_showcase.id.DELETE,
    async ({ input, output }) => {
      await this.moduleController.delete(input.params.id);
      return output(200, {
        status: "success",
        message: "Member Showcase deleted successfully",
      });
    },
  );

  getSpotlight: RequestHandler = createExpressController(
    contract.api.v1.member_showcase.spotlight.GET,
    async ({ output }) => {
      const result = await this.moduleController.getSpotlight();
      if (!result) {
        return output(404, {
           status: "error",
           message: "No spotlight found for today",
           errors: [{ title: "Not Found", detail: "No spotlight found for today" }]
        } as any);
      }
      return output(200, {
        status: "success",
        message: "Spotlight fetched successfully",
        data: result,
      });
    },
  );
}

export class MemberShowcaseRouter {
  router: Router;

  constructor(private readonly controller: MemberShowcaseHttpController) {
    this.router = Router();

    this.router.post("/", this.controller.postCreate);
    this.router.get("/", this.controller.getList);
    this.router.get("/spotlight", this.controller.getSpotlight);
    this.router.get("/:id", this.controller.getOne);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteDelete);
  }
}
