import { RequestHandler } from "express";
import { ProjectService, projectServiceInstance } from "./project.service.js";

export class UserResourceSystemController {
  constructor(
    private projectService: ProjectService = projectServiceInstance
  ) {}

  create: RequestHandler = async (req, res) => {
    const userId = req.user!.id; // user id from token parser

    const dto = req.body;
    const { data, error } = await this.projectService.create(dto, userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };
}

export const userResourceSystemControllerInstance = new UserResourceSystemController();
