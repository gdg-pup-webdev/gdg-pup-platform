import { RequestHandler } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";  
import { ArticlesController } from "@/v1/modules/articles/ArticleController";  

/**
 * EventHighlightsHttpController
 * Presentation layer controller for event highlights.
 */
export class ArticlesHttpController {
  constructor(private appController : ArticlesController) {}


  postCreate: RequestHandler = createExpressController(
    contract.api.v1.articles.POST,
    async ({ input, output }) => {
      const thumbnailImage = input.files.thumbnail_image;

      const result = await this.appController.create({
        title: input.body.data.title,
        description: input.body.data.description,
        content: input.body.data.content,
        imageUrl: input.body.data.image_url ?? undefined,
        authorId: input.body.data.author_id,
        eventId: input.body.data.event_id,
        thumbnailImage: thumbnailImage ? {
          buffer: await thumbnailImage.arrayBuffer(),
          name: thumbnailImage.name,
          type: thumbnailImage.type,
        } : undefined,
        published_at: new Date(input.body.data.published_at || ""),
        is_published: input.body.data.is_published
      });

      return output(201, {
        status: "success",
        message: "Event highlight created successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
          created_at: result.createdAt ,
          updated_at: result.updatedAt ,
          author_id: result.authorId,
          event_id: result.eventId,
          published_at : result.published_at ? result.published_at.toISOString() : null,
          is_published: result.is_published
        },
      });
    },
  );

  getList: RequestHandler = createExpressController(
    contract.api.v1.articles.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const eventId = input.query.eventId;

      const { list, count } = await this.appController.list(
        pageNumber,
        pageSize,
        eventId,
      );

      return output(200, {
        status: "success",
        message: "Event highlights fetched successfully",
        data: list.map((item) => ({
          ...item,
          image_url: item.imageUrl ?? null,
          created_at: item.createdAt ,
          updated_at: item.updatedAt ,
          author_id: item.authorId,
          event_id: item.eventId,
          published_at: item.published_at?.toISOString() || null,
          is_published: item.is_published
        })),
        meta: {
          totalRecords: count,
          pageSize,
          currentPage: pageNumber,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.v1.articles.id.GET,
    async ({ input, output }) => {
      const result = await this.appController.getOne(input.params.id);

      return output(200, {
        status: "success",
        message: "Event highlight fetched successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
          created_at: result.createdAt ,
          updated_at: result.updatedAt ,
          author_id: result.authorId,
          event_id: result.eventId,
          published_at: result.published_at?.toISOString() || null,
          is_published: result.is_published
        },
      });
    },
  );

  patchUpdate: RequestHandler = createExpressController(
    contract.api.v1.articles.id.PATCH,
    async ({ input, output }) => {
      const thumbnailImage = input.files.thumbnail_image;

      const result = await this.appController.update(input.params.id, {
        title: input.body.data.title,
        description: input.body.data.description,
        content: input.body.data.content,
        imageUrl: input.body.data.image_url ?? undefined,
        authorId: input.body.data.author_id,
        eventId: input.body.data.event_id,
        thumbnailImage: thumbnailImage ? {
          buffer: await thumbnailImage.arrayBuffer(),
          name: thumbnailImage.name,
          type: thumbnailImage.type,
        } : undefined,
        published_at: new Date(input.body.data.published_at || ""),
        is_published: input.body.data.is_published
      });

      return output(200, {
        status: "success",
        message: "Event highlight updated successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
          created_at: result.createdAt ,
          updated_at: result.updatedAt ,
          author_id: result.authorId,
          event_id: result.eventId,
          published_at: result.published_at?.toISOString() || null,
          is_published: result.is_published
        },
      });
    },
  );

  deleteItem: RequestHandler = createExpressController(
    contract.api.v1.articles.id.DELETE,
    async ({ input, output }) => {
      await this.appController.delete(input.params.id);

      return output(200, {
        status: "success",
        message: "Event highlight deleted successfully",
      });
    },
  );
}
