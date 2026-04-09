import { eventSystemController } from "@/v1/modules/eventSystem";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class EventsHttpController {
  constructor(private eventController: typeof eventSystemController) {}

  syncOneEventToBevy: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.syncToBevy.POST,
    async ({ input, output }) => {
      const result = await this.eventController.syncEventToBevy(
        input.params.eventId,
      );
      return output(200, {
        status: "success",
        message: "Event synced successfully",
        data: result,
      });
    },
  );

  syncAllEventToBevy: RequestHandler = createExpressController(
    contract.api.v1.events.syncAllToBevy.POST,
    async ({ input, output }) => {
      const res = await this.eventController.importAndSyncAllToBevy();
      return output(200, {
        status: "success",
        message: "Event synced successfully",
        data: {
          success: res.successCount,
          fail: res.failCount,
          failMessages: res.failMessages,
        },
      });
    },
  );

  listEvents: RequestHandler = createExpressController(
    contract.api.v1.events.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const filters = {
        type: input.query.type,
        teamId: input.query.teamId,
        teamName: input.query.teamName,
        category: input.query.category,
        year: input.query.year,
      };

      const { list, count } = await this.eventController.listEvents(
        pageNumber,
        pageSize,
        filters,
      );

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: list as any,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  getEventsByType: RequestHandler = createExpressController(
    contract.api.v1.events.by_type.type.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.eventController.getEventsByType(
        input.params.type,
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: `Events with type ${input.params.type} fetched successfully`,
        data: list as any,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  getEventsByTeam: RequestHandler = createExpressController(
    contract.api.v1.events.by_team.teamId.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.eventController.getEventsByTeam(
        input.params.teamId,
        pageNumber,
        pageSize,
      );

      return output(200, {
        status: "success",
        message: `Events for team ${input.params.teamId} fetched successfully`,
        data: list as any,
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  createEvent: RequestHandler = createExpressController(
    contract.api.v1.events.POST,
    async ({ input, output }) => {
      const imageFile = input.files?.thumbnail;

      const result = await this.eventController.createEvent({
        ...input.body.data,
        beviPreviewUrl: input.body.data.bevyPreviewUrl || undefined,
        image: imageFile || null,
        image_url: input.body.data.image_url || undefined,
        short_description: input.body.data.short_description || undefined,
        type: input.body.data.type || undefined,
        teamId: input.body.data.teamId || undefined,
      });

      return output(200, {
        status: "success",
        message: "Event created successfully",
        data: result as any,
      });
    },
  );

  getEventById: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.GET,
    async ({ input, output }) => {
      const result = await this.eventController.getOneEvent(
        input.params.eventId,
      );

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data: result as any,
      });
    },
  );

  updateEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.PATCH,
    async ({ input, output }) => {
      const imageFile = input.files?.thumbnail;

      const result = await this.eventController.updateEvent(
        input.params.eventId,
        {
          ...input.body.data,
          image: imageFile || null,
        },
      );

      return output(200, {
        status: "success",
        message: "Event updated successfully",
        data: result as any,
      });
    },
  );

  deleteEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.DELETE,
    async ({ input, output }) => {
      await this.eventController.deleteEvent(input.params.eventId);

      return output(200, {
        status: "success",
        message: "Event deleted successfully",
      });
    },
  );
}
