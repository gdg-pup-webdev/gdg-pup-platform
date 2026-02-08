import { RequestHandler } from "express";
import {
  ExternalResourceService,
  resourceServiceInstance,
} from "./externalResource.service.js";
import { contract, models } from "@packages/nexus-api-contracts";
import {
  ControllerError,
  ServerError_DEPRECATED,
  ServiceError,
} from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { handleServerError, tryCatch } from "@/utils/tryCatch.util.js";

export class ExternalResourceController {
  constructor(
    private readonly resourceService: ExternalResourceService = resourceServiceInstance,
  ) {}

  createExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const user = req.user!;
      const userId = user.id;

      const { data, error } = await tryCatch(
        async () => await this.resourceService.create(input.body.data, userId),
        "creating external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource created successfully",
        data,
      });
    },
  );

  deleteExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .DELETE,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId;
      const { error } = await tryCatch(
        async () => await this.resourceService.delete(resourceId),
        "deleting external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource deleted successfully",
      });
    },
  );

  updateExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .PATCH,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId;
      const { data, error } = await tryCatch(
        async () =>
          await this.resourceService.update(resourceId, input.body.data),
        "updating external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource updated successfully",
        data,
      });
    },
  );

  listExternalResources: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const { data, error } = await tryCatch(
        async () => await this.resourceService.list(),
        "listing external resources",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resources fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  getOneExternalResource: RequestHandler = createExpressController(
    contract.api.learning_resource_system.external_resources.externalResourceId
      .GET,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.externalResourceId as string;
      const { data, error } = await tryCatch(
        async () => await this.resourceService.getOne(resourceId),
        "getting one external resource",
      );

      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Resource fetched successfully",
        data,
      });
    },
  );
}

export const externalResourceControllerInstance =
  new ExternalResourceController();
