import { RequestHandler } from "express";
import {
  ResourceService,
  resourceServiceInstance,
} from "./resource.service.js";
import { createExpressController } from "@packages/api-typing";
import { Contract  } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";

export class ResourceSystemController {
  constructor(
    private readonly resourceService: ResourceService = resourceServiceInstance
  ) {}

  create: RequestHandler = createExpressController(
    Contract.resourceSystem.resources.post,
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

  delete: RequestHandler = async (req, res) => {
    const resourceId = req.params.resourceId as string;
    const { data, error } = await this.resourceService.delete(resourceId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  update: RequestHandler = async (req, res) => {
    const resourceId = req.params.resourceId as string;
    const { data, error } = await this.resourceService.update(
      resourceId,
      req.body
    );
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  list: RequestHandler = async (req, res) => {
    const { data, error } = await this.resourceService.list();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  getOne: RequestHandler = async (req, res) => {
    const resourceId = req.params.resourceId as string;
    const { data, error } = await this.resourceService.getOne(resourceId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };
}

export const resourceSystemControllerInstance = new ResourceSystemController();
