import { RequestHandler } from "express";
import { contract } from "@packages/nexus-api-contracts";
import { ServiceError } from "@/classes/ServerError.js";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";
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
        const { data, error } = await tryCatch(
          async () => await this.projectService.listProjectsOfUser(userId),
          "getting user projects",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.projectService.listProjects(),
          "getting all projects",
        );

        if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.projectService.getOneProject(projectId),
        "fetching project",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.projectService.createProject(dto),
        "creating project",
      );
      if (error) throw new ServiceError(error.message);

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

      const { data, error } = await tryCatch(
        async () => await this.projectService.updateProject(projectId, dto),
        "updating project",
      );
      if (error) throw new ServiceError(error.message);

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
      const { data, error } = await tryCatch(
        async () => await this.projectService.deleteProject(projectId),
        "deleting project",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Project deleted successfully",
      });
    },
  );
}

export const projectControllerInstance = new ProjectController();
