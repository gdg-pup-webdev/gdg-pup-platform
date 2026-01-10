import { RequestHandler } from "express";
import {
  ResourceService,
  resourceServiceInstance,
} from "./resource.service.js";

export class ResourceSystemController {
  constructor(
    private readonly resourceService: ResourceService = resourceServiceInstance
  ) {}

  create: RequestHandler = async (req, res) => {
    const user = req.user!;
    const userId = user.id;
    const { data, error } = await this.resourceService.create(req.body, userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  delete: RequestHandler = async (req, res) => {
    const { resourceId } = req.params;
    const { data, error } = await this.resourceService.delete(resourceId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  update: RequestHandler = async (req, res) => {
    const { resourceId } = req.params;
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
    const { resourceId } = req.params;
    const { data, error } = await this.resourceService.getOne(resourceId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };
}

export const resourceSystemControllerInstance = new ResourceSystemController();
