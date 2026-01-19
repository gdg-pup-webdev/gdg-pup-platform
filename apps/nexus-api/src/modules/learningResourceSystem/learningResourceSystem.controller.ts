import { RequestHandler } from "express";
import {
  ExternalResourceService,
  resourceServiceInstance,
} from "./externalResource.service.js";
import { contract } from "@packages/nexus-api-contracts";
import { ControllerError, ServerError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { handleServerError, tryCatchHandled } from "@/utils/tryCatch.util.js";

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
        {
          onServerError: handleServerError(
            "on controller, calling service.create",
          ),
        },
      );

      if (error)
        throw new ControllerError(
          "LearningResourceSystemController",
          error.message,
          "Controller create external resource",
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
        { onServerError: handleServerError("deleting external resource") },
      );

      if (error) {
        throw new ControllerError(
          "LearningResourceSystemController",
          error.message,
          "Controller delete external resource",
        );
      }

      return output(200, {
        status: "success",
        message: "Resource deleted successfully",
      });
    },
  );

  updateExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.externalResources.externalResourceId
      .PATCH,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId;
      const { data, error } = await tryCatchHandled(
        async () =>
          await this.resourceService.update(resourceId, input.body.data),
        { onServerError: handleServerError("updating external resource") },
      );
      if (error)
        throw new ControllerError(
          "LearningResourceSystemController",
          error.message,
          "Controller update external resource",
        );

      return output(200, {
        status: "success",
        message: "Resource updated successfully",
        data,
      });
    },
  );

  listExternalResources: RequestHandler = createExpressController(
    contract.api.learning_resource_system.externalResources.GET,
    async ({ input, output, ctx }) => {
      const { data, error } = await tryCatchHandled(
        async () => await this.resourceService.list(),
        { onServerError: handleServerError("listing external resources") },
      );

      if (error)
        throw new ControllerError(
          "LearningResourceSystemController",
          error.message,
          "Controller list external resource",
        );

      return output(200, {
        status: "success",
        message: "Resources fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
          totalPages: Math.ceil(data.count / input.query.page.size),
        },
      });
    },
  );

  getOneExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.externalResources.externalResourceId
      .GET,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId as string;
      const { data, error } = await tryCatchHandled(
        async () => await this.resourceService.getOne(resourceId),
        {
          onServerError: handleServerError("getting external resource"),
        },
      );

      if (error)
        throw new ControllerError(
          "LearningResourceSystemController",
          error.message,
          "Controller get one external resource",
        );

      return output(200, {
        status: "success",
        message: "Resource fetched successfully",
        data,
      });
    },
  );
}

export const learningResourceSystemControllerInstance =
  new LearningResourceSystemController();
