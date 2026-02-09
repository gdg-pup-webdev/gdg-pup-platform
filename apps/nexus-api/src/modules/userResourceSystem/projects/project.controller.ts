import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { ProjectService, projectServiceInstance } from "./project.service";

export class ProjectController {
  constructor(
    private projectService: ProjectService = projectServiceInstance,
  ) {}

  listUserProjects: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.GET,
    async ({ input, output, ctx }) => {
      // pagination options
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId;

      let list, count;
      if (userId) {
        const data = await this.projectService.listProjectsOfUser(userId);

        list = data.list;
        count = data.count;
      } else {
        const data = await this.projectService.listProjects();

        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "User projects fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: pageNumber,
          pageSize,
        },
      });
    },
  );

  getOneProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.GET,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId;
      const data = await this.projectService.getOneProject(projectId);

      return output(200, {
        status: "success",
        message: "Project fetched successfully",
        data,
      });
    },
  );

  createProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.POST,
    async ({ input, output }) => {
      const dto = input.body.data;
      const data = await this.projectService.createProject(dto);

      return output(201, {
        status: "success",
        message: "Project created successfully",
        data,
      });
    },
  );

  updateProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.PATCH,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId as string;
      const dto = input.body.data;

      const data = await this.projectService.updateProject(projectId, dto);

      return output(200, {
        status: "success",
        message: "Project updated successfully",
        data,
      });
    },
  );

  deleteProject: RequestHandler = createExpressController(
    contract.api.user_resource_system.projects.projectId.DELETE,
    async ({ input, output, ctx }) => {
      const projectId = input.params.projectId;
      const data = await this.projectService.deleteProject(projectId);

      return output(200, {
        status: "success",
        message: "Project deleted successfully",
      });
    },
  );
}

export const projectControllerInstance = new ProjectController();
