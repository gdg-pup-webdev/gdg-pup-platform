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
        teamId: input.query.teamId as string | undefined,
        teamName: input.query.teamName as string | undefined,
        eventId: input.query.eventId as string | undefined,
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
          tags: r.tags,
          teamId: r.teamId,
          eventId: r.eventId,
          thumbnailUrl: r.thumbnailUrl,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          team: r.team || null,
          event: r.event ? {
            ...r.event,
            startDate: r.event.startDate ? new Date(r.event.startDate) : null,
            endDate: r.event.endDate ? new Date(r.event.endDate) : null,
          } : null,
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

  searchResources: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.search.GET,
    async ({ input, output }) => {
      const result = await this.learningResourceController.searchResources(
        input.query.q,
        input.query.limit
      );

      return output(200, {
        status: "success",
        message: "Learning resources searched successfully",
        data: result.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          url: r.url,
          tags: r.tags,
          teamId: r.teamId,
          eventId: r.eventId,
          thumbnailUrl: r.thumbnailUrl,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          team: r.team || null,
          event: r.event ? {
            ...r.event,
            startDate: r.event.startDate ? new Date(r.event.startDate) : null,
            endDate: r.event.endDate ? new Date(r.event.endDate) : null,
          } : null,
        })),
      });
    }
  );

  listByTag: RequestHandler = createExpressController(
    contract.api.v1.learning_resources.tags.tag.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.learningResourceController.listResourcesByTag(
        input.params.tag,
        pageNumber,
        pageSize
      );

      return output(200, {
        status: "success",
        message: `Learning resources with tag ${input.params.tag} fetched successfully`,
        data: list.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          url: r.url,
          tags: r.tags,
          teamId: r.teamId,
          eventId: r.eventId,
          thumbnailUrl: r.thumbnailUrl,
          createdAt: new Date(r.createdAt),
          updatedAt: new Date(r.updatedAt),
          team: r.team || null,
          event: r.event ? {
            ...r.event,
            startDate: r.event.startDate ? new Date(r.event.startDate) : null,
            endDate: r.event.endDate ? new Date(r.event.endDate) : null,
          } : null,
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
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          team: result.team || null,
          event: result.event ? {
            ...result.event,
            startDate: result.event.startDate ? new Date(result.event.startDate) : null,
            endDate: result.event.endDate ? new Date(result.event.endDate) : null,
          } : null,
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
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          team: result.team || null,
          event: result.event ? {
            ...result.event,
            startDate: result.event.startDate ? new Date(result.event.startDate) : null,
            endDate: result.event.endDate ? new Date(result.event.endDate) : null,
          } : null,
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
          tags: result.tags,
          teamId: result.teamId,
          eventId: result.eventId,
          thumbnailUrl: result.thumbnailUrl,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          team: result.team || null,
          event: result.event ? {
            ...result.event,
            startDate: result.event.startDate ? new Date(result.event.startDate) : null,
            endDate: result.event.endDate ? new Date(result.event.endDate) : null,
          } : null,
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
      });
    }
  );
}
