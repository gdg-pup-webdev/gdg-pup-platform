import { TeamResourceController } from "@/v1/modules/teamResources";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class TeamResourcesHttpController {
  constructor(private teamResourceController: TeamResourceController) {}

  listResources: RequestHandler = createExpressController(
    contract.api.v1.team_resources.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const filters = {
        teamName: input.query.team_name,
        resourceType: input.query.resource_type,
        search: input.query.search,
      };

      const { list, count } = await this.teamResourceController.listResources(
        pageNumber,
        pageSize,
        filters
      );

      return output(200, {
        status: "success",
        message: "Team resources fetched successfully",
        data: list.map((r) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          resource_link: r.resourceLink,
          resource_type: r.resourceType,
          thumbnail_public_url: r.thumbnailPublicUrl,
          team_name: r.teamName,
          created_at: r.createdAt,
          updated_at: r.updatedAt,
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
    contract.api.v1.team_resources.POST,
    async ({ input, output }) => {
      const thumbnailFile = input.files.thumbnail_image;

      if (!thumbnailFile) {
        return output(400, {
          status: "fail",
          message: "Thumbnail image is required",
          errors: [{ title: "Missing File", detail: "thumbnail_image is required", source: "files" }],
        });
      }

      const result = await this.teamResourceController.create({
        title: input.body.data.title,
        description: input.body.data.description,
        resourceLink: input.body.data.resource_link,
        resourceType: input.body.data.resource_type,
        teamName: input.body.data.team_name,
        thumbnailImage: {
          buffer: await thumbnailFile.arrayBuffer(),
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        },
      });

      return output(201, {
        status: "success",
        message: "Team resource created successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          resource_link: result.resourceLink,
          resource_type: result.resourceType,
          thumbnail_public_url: result.thumbnailPublicUrl,
          team_name: result.teamName,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    }
  );

  getResourceById: RequestHandler = createExpressController(
    contract.api.v1.team_resources.teamResourceId.GET,
    async ({ input, output }) => {
      const result = await this.teamResourceController.getResource(input.params.teamResourceId);

      return output(200, {
        status: "success",
        message: "Team resource fetched successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          resource_link: result.resourceLink,
          resource_type: result.resourceType,
          thumbnail_public_url: result.thumbnailPublicUrl,
          team_name: result.teamName,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    }
  );

  updateResource: RequestHandler = createExpressController(
    contract.api.v1.team_resources.teamResourceId.PATCH,
    async ({ input, output }) => {
      const thumbnailFile = input.files.thumbnail_image;
      
      const updates: any = {
        title: input.body.data.title,
        description: input.body.data.description,
        resourceLink: input.body.data.resource_link,
        resourceType: input.body.data.resource_type,
        teamName: input.body.data.team_name,
      };

      if (thumbnailFile) {
        updates.thumbnailImage = {
          buffer: await thumbnailFile.arrayBuffer(),
          name: thumbnailFile.name,
          type: thumbnailFile.type,
        };
      }

      const result = await this.teamResourceController.updateResource(input.params.teamResourceId, updates);

      return output(200, {
        status: "success",
        message: "Team resource updated successfully",
        data: {
          id: result.id,
          title: result.title,
          description: result.description,
          resource_link: result.resourceLink,
          resource_type: result.resourceType,
          thumbnail_public_url: result.thumbnailPublicUrl,
          team_name: result.teamName,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
        },
      });
    }
  );

  deleteResource: RequestHandler = createExpressController(
    contract.api.v1.team_resources.teamResourceId.DELETE,
    async ({ input, output }) => {
      await this.teamResourceController.deleteResource(input.params.teamResourceId);
      
      return output(200, {
        status: "success",
        message: "Team resource deleted successfully",
        data: { success: true },
      });
    }
  );
}
