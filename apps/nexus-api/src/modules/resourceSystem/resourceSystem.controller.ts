import { RequestHandler } from "express";
import {
  ResourceService,
  resourceServiceInstance,
} from "./resource.service.js"; 
import { contract } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";

export class ResourceSystemController {
  constructor(
    private readonly resourceService: ResourceService = resourceServiceInstance
  ) {}

  create: RequestHandler = createExpressController(
    contract.api.resource_system.resources.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const user = req.user!;
      const userId = user.id;

      const { data, error } = await this.resourceService.create(
        input.body.data,
        userId
      );
      if (error) {
        throw new ServerError(500, error.message);
      }

      return output(200, {
        status: "success",
        message: "Resource created successfully",
        data,
      });
    }
  );

  delete: RequestHandler = createExpressController(
    contract.api.resource_system.resources.resourceId.DELETE,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.resourceId;
      const { data, error } = await this.resourceService.delete(resourceId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Resource deleted successfully",
      });
    }
  );

  update: RequestHandler = createExpressController(
    contract.api.resource_system.resources.resourceId.PATCH,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.resourceId as string;
      const { data, error } = await this.resourceService.update(
        resourceId,
        input.body.data
      );
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Resource updated successfully",
        data,
      });
    }
  );

  list: RequestHandler = createExpressController(
    contract.api.resource_system.resources.GET,
    async ({ input, output, ctx }) => {
      const { data, error } = await this.resourceService.list();
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
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
    }
  );

  getOne: RequestHandler = createExpressController(
    contract.api.resource_system.resources.resourceId.GET,
    async ({ input, output, ctx }) => {
      const resourceId = input.params.resourceId as string;
      const { data, error } = await this.resourceService.getOne(resourceId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Resource fetched successfully",
        data,
      });
    }
  );
}

export const resourceSystemControllerInstance = new ResourceSystemController();
