import { RequestHandler, Router } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { memberProjectsController as moduleController } from "@/v1/modules/memberProjects";
import { UnauthorizedError, ValidationError } from "@/v1/errors/HttpError";

export class MemberProjectsHttpController {
  constructor(private readonly module: typeof moduleController) {}

  postCreate: RequestHandler = createExpressController(
    contract.api.v1.member_projects.POST,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const result = await this.module.create(actorId, {
        ...input.body.data,
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
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const result = await this.module.update(actorId, {
        id: input.params.id,
        ...input.body.data,
      });

      return output(200, {
        status: "success",
        message: "Member project updated successfully",
        data: result,
      });
    },
  );

  postAddImage: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.images.POST,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const image = input.files.image;

      if (!image) {
        throw new ValidationError("Image file is required.");
      }

      const result = await this.module.addImage(actorId, {
        id: input.params.id,
        image: {
          buffer: await image.arrayBuffer(),
          name: image.name,
          type: image.type,
        },
      });

      return output(200, {
        status: "success",
        message: "Member project image added successfully",
        data: result,
      });
    },
  );

  deleteImage: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.images.imageIndex.DELETE,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const imageIndex = Number(input.params.imageIndex);

      if (!Number.isInteger(imageIndex) || imageIndex < 0) {
        throw new ValidationError("imageIndex must be a non-negative integer.");
      }

      const result = await this.module.deleteImage(actorId, {
        id: input.params.id,
        imageIndex,
      });

      return output(200, {
        status: "success",
        message: "Member project image deleted successfully",
        data: result,
      });
    },
  );

  patchReorderImages: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.images.reorder.PATCH,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      const result = await this.module.reorderImages(actorId, {
        id: input.params.id,
        fromIndex: input.body.data.fromIndex,
        toIndex: input.body.data.toIndex,
      });

      return output(200, {
        status: "success",
        message: "Member project images reordered successfully",
        data: result,
      });
    },
  );

  deleteDelete: RequestHandler = createExpressController(
    contract.api.v1.member_projects.id.DELETE,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      await this.module.delete(actorId, input.params.id);
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

  patchReorderProjectsByMember: RequestHandler = createExpressController(
    contract.api.v1.member_projects.member.memberGdgId.reorder.PATCH,
    async ({ input, output, ctx }) => {
      const actorId =
        ctx.req.decodedToken?.memberInfo.gdgId ?? ctx.req.user?.id;
      if (!actorId) {
        throw new UnauthorizedError(
          "Authentication required. Please provide a valid Bearer token.",
        );
      }

      await this.module.reorderProjects(actorId, {
        memberGdgId: input.params.memberGdgId,
        fromIndex: input.body.data.fromIndex,
        toIndex: input.body.data.toIndex,
      });

      return output(200, {
        status: "success",
        message: "Member projects reordered successfully",
      });
    },
  );

  getSearch: RequestHandler = createExpressController(
    contract.api.v1.member_projects.search.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.module.search(
        input.query.query,
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: "Search results fetched successfully",
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

  getRandom: RequestHandler = createExpressController(
    contract.api.v1.member_projects.random.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.module.getRandom(pageNumber, pageSize);

      return output(200, {
        status: "success",
        message: "Random projects fetched successfully",
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

  constructor(private readonly controller: MemberProjectsHttpController) {
    this.router = Router();

    this.router.post("/", this.controller.postCreate);
    this.router.get("/", this.controller.getList);
    this.router.get("/search", this.controller.getSearch);
    this.router.get("/random", this.controller.getRandom);
    this.router.get("/:id", this.controller.getOne);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.post("/:id/images", this.controller.postAddImage);
    this.router.patch(
      "/:id/images/reorder",
      this.controller.patchReorderImages,
    );
    this.router.delete("/:id/images/:imageIndex", this.controller.deleteImage);
    this.router.delete("/:id", this.controller.deleteDelete);
    this.router.patch(
      "/member/:memberGdgId/reorder",
      this.controller.patchReorderProjectsByMember,
    );
    this.router.get("/member/:memberGdgId", this.controller.getByMember);
  }
}
