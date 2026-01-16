import { RequestHandler } from "express";
import { ProjectService, projectServiceInstance } from "./project.service.js"; 
import { contract } from "@packages/nexus-api-contracts";
import { ServerError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";

export class UserResourceSystemController {
  constructor(
    private projectService: ProjectService = projectServiceInstance
  ) {}

  getOneProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.GET,
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

  createProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.POST,
    async ({ input, output, ctx }) => {
      const { res, req } = ctx;
      const userId = req.user!.id; // user id from token parser

      const dto = input.body.data;
      const { data, error } = await this.projectService.create(dto, userId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(201, {
        status: "success",
        message: "Project created successfully",
        data,
      });
    }
  );

  updateProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.PATCH,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId as string;
      const dto = input.body.data;

      const { data, error } = await this.projectService.update(projectId, dto);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Project updated successfully",
        data,
      });
    }
  );

  deleteProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.DELETE,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId;
      const { data, error } = await this.projectService.delete(projectId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Project deleted successfully",
      });
    }
  );
}

export const userResourceSystemControllerInstance =
  new UserResourceSystemController();
