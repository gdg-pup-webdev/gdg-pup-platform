import { RequestHandler } from "express";
import {
  ExternalResourceService,
  resourceServiceInstance,
} from "./externalResource.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ControllerError, ServerError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { rethrowServerError, tryCatchHandled } from "@/utils/tryCatch.util.js";

export class LearningResourceSystemController {
  constructor(
    private readonly resourceService: ExternalResourceService = resourceServiceInstance,
  ) {}

  createExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.externalResources.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const user = req.user!;
      const userId = user.id;

      const { data, error } = await tryCatchHandled(
        async () => await this.resourceService.create(input.body.data, userId),
        { onServerError: rethrowServerError("creating external resource") },
      );

      if (error)
        throw new ControllerError(
          "LearningResourceSystemController",
          "create",
          `Something went wrong: ${error.message}`,
        );

      return output(200, {
        status: "success",
        message: "Resource created successfully",
        data,
      });
    },
  );

  deleteExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.externalResources.externalResourceId
      .DELETE,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId;
      const { error } = await tryCatchHandled(
        async () => await this.resourceService.delete(resourceId),
        { onServerError: rethrowServerError("deleting external resource") },
      );

      if (error) {
        throw new ControllerError(
          "LearningResourceSystemController",
          "delete",
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Resource deleted successfully",
      });
    },
  );

  updateExternalResource: RequestHandler = createExpressController(
    contract.api.resource_system.resources.resourceId.PATCH,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.resourceId as string;
      const { data, error } = await this.resourceService.update(
        resourceId,
        input.body.data,
      );
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Resource updated successfully",
        data,
      });
    },
  );

  list: RequestHandler = createExpressController(
    contract.api.resource_system.resources.GET,
    async ({ input, output, ctx }) => {
      const { data, error } = await this.resourceService.list();
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Resources fetched successfully",
        data: data.listData,
        meta: {
          totalRecords: data.count,
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
          totalPages: Math.ceil(data.count / input.query.page.size),
        },
      });
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.resource_system.resources.resourceId.GET,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.resourceId as string;
      const { data, error } = await this.resourceService.getOne(resourceId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`,
        );
      }

      return output(200, {
        status: "success",
        message: "Resource fetched successfully",
        data,
      });
    },
  );
}

export const resourceSystemControllerInstance =
  new LearningResourceSystemController();
