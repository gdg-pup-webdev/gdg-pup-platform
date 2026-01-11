import { RequestHandler } from "express";
import { ProjectService, projectServiceInstance } from "./project.service.js";
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";

export class UserResourceSystemController {
  constructor(
    private projectService: ProjectService = projectServiceInstance
  ) {}

  getOne: RequestHandler = createExpressController(
    Contract.userResourceSystem.projects.project.get,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId;
      const { data, error } = await this.projectService.getOne(projectId);
      if (error) {
        throw new ServerError(
          500,
          "Something happened inside the controller",
          `Message: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "Project fetched successfully",
        data,
      });
    }
  );

  create: RequestHandler = async (req, res) => {
    const userId = req.user!.id; // user id from token parser

    const dto = req.body;
    const { data, error } = await this.projectService.create(dto, userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  update: RequestHandler = async (req, res) => {
    const projectId = req.params.projectId as string;
    const dto = req.body;

    const { data, error } = await this.projectService.update(projectId, dto);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  delete: RequestHandler = async (req, res) => {
    const projectId = req.params.projectId as string;
    const { data, error } = await this.projectService.delete(projectId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };
}

export const userResourceSystemControllerInstance =
  new UserResourceSystemController();
