import { RequestHandler } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { eventHighlightsController as appController } from "../../modules/eventHighlights";

/**
 * EventHighlightsHttpController
 * Presentation layer controller for event highlights.
 */
export class EventHighlightsHttpController {
  postCreate: RequestHandler = createExpressController(
    contract.api.v1.event_highlights.POST,
    async ({ input, output }) => {
      const result = await appController.createHighlight({
        title: input.body.data.title,
        description: input.body.data.description,
        content: input.body.data.content,
        imageUrl: input.body.data.image_url ?? undefined,
        authorId: input.body.data.author_id,
        eventId: input.body.data.event_id,
      });

      return output(201, {
        status: "success",
        message: "Event highlight created successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
        },
      });
    },
  );

  getList: RequestHandler = createExpressController(
    contract.api.v1.event_highlights.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const eventId = input.query.eventId;

      const { list, count } = await appController.listHighlights(
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
    contract.api.v1.event_highlights.id.GET,
    async ({ input, output }) => {
      const result = await appController.getOneHighlight(input.params.id);

      return output(200, {
        status: "success",
        message: "Event highlight fetched successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
        },
      });
    },
  );

  patchUpdate: RequestHandler = createExpressController(
    contract.api.v1.event_highlights.id.PATCH,
    async ({ input, output }) => {
      const result = await appController.updateHighlight(input.params.id, {
        title: input.body.data.title,
        description: input.body.data.description,
        content: input.body.data.content,
        imageUrl: input.body.data.image_url ?? undefined,
        authorId: input.body.data.author_id,
        eventId: input.body.data.event_id,
      });

      return output(200, {
        status: "success",
        message: "Event highlight updated successfully",
        data: {
          ...result,
          image_url: result.imageUrl ?? null,
        },
      });
    },
  );

  deleteItem: RequestHandler = createExpressController(
    contract.api.v1.event_highlights.id.DELETE,
    async ({ input, output }) => {
      await appController.deleteHighlight(input.params.id);

      return output(200, {
        status: "success",
        message: "Event highlight deleted successfully",
      });
    },
  );
}
