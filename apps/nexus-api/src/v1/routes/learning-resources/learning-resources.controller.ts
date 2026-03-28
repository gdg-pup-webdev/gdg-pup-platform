import { LearningResourceController } from "@/v1/modules/learningResources";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class LearningResourcesHttpController {
  constructor(private learningResourceController: LearningResourceController) {}

  listResources: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const filters = {
        type: input.query.type,
        teamId: input.query.teamId,
        eventId: input.query.eventId,
        search: input.query.search,
      };

      const { list, count } = await this.learningResourceController.listResources(
        pageNumber,
        pageSize,
        filters
      );

      return output(200, {
        status: "success",
        message: "Learning resources fetched successfully",
        data: list.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          url: r.url,
          type: r.type,
          tags: r.tags,
          teamId: r.teamId,
          eventId: r.eventId,
          thumbnailUrl: r.thumbnailUrl,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
        })),
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    }
  );

  createResource: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.POST,
    async ({ input, output }) => {
      const thumbnailFile = input.files?.thumbnailImage;

      const result = await this.learningResourceController.create({
        title: input.body.data.title,
        description: input.body.data.description,
        url: input.body.data.url,
        type: input.body.data.type,
        tags: input.body.data.tags,
        teamId: input.body.data.teamId,
        eventId: input.body.data.eventId,
        thumbnailImage: thumbnailFile ? {
          buffer: await thumbnailFile.arrayBuffer(),
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        } : undefined,
      });

      return output(200, {
        status: "success",
        message: "Learning resource created successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          url: result.url,
          type: result.type,
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        },
      });
    }
  );

  getResourceById: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.learningResourceId.GET,
    async ({ input, output }) => {
      const result = await this.learningResourceController.getResource(input.params.learningResourceId);

      if (!result) {
        return output(404, {
          status: "fail",
          message: "Learning resource not found",
          errors: [{ title: "Not Found", detail: `No learning resource found with ID ${input.params.learningResourceId}` }],
        });
      }

      return output(200, {
        status: "success",
        message: "Learning resource fetched successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          url: result.url,
          type: result.type,
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        },
      });
    }
  );

  updateResource: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.learningResourceId.PATCH,
    async ({ input, output }) => {
      const thumbnailFile = input.files?.thumbnailImage;
      
      const updates: any = {
        title: input.body.data.title,
        description: input.body.data.description,
        url: input.body.data.url,
        type: input.body.data.type,
        tags: input.body.data.tags,
        teamId: input.body.data.teamId,
        eventId: input.body.data.eventId,
      };

      if (thumbnailFile) {
        updates.thumbnailImage = {
          buffer: await thumbnailFile.arrayBuffer(),
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        };
      }

      const result = await this.learningResourceController.updateResource(input.params.learningResourceId, updates);

      return output(200, {
        status: "success",
        message: "Learning resource updated successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          url: result.url,
          type: result.type,
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        },
      });
    }
  );

  deleteResource: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.learningResourceId.DELETE,
    async ({ input, output }) => {
      await this.learningResourceController.deleteResource(input.params.learningResourceId);
      
      return output(200, {
        status: "success",
        message: "Learning resource deleted successfully",
        data: { success: true },
      });
    }
  );
}
