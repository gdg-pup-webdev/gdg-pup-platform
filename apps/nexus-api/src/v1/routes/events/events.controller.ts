import { eventSystemController } from "@/v1/modules/eventSystem";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";

export class EventsHttpController {
  constructor(private eventController: typeof eventSystemController) {}

  listEvents: RequestHandler = createExpressController(
    contract.api.v1.events.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;
      const filters = {
        type: input.query.type,
        teamId: input.query.teamId,
        category: input.query.category,
      };

      const { list, count } = await this.eventController.listEvents(
        pageNumber,
        pageSize,
        filters
      );

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: list.map((e) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          start_date: new Date(e.start_date),
          end_date: new Date(e.end_date),
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

  getEventsByType: RequestHandler = createExpressController(
    contract.api.v1.events.by_type.type.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.eventController.getEventsByType(
        input.params.type,
        pageNumber,
        pageSize
      );

      return output(200, {
        status: "success",
        message: `Events with type ${input.params.type} fetched successfully`,
        data: list.map((e) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          start_date: new Date(e.start_date),
          end_date: new Date(e.end_date),
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

  getEventsByTeam: RequestHandler = createExpressController(
    contract.api.v1.events.by_team.teamId.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } = await this.eventController.getEventsByTeam(
        input.params.teamId,
        pageNumber,
        pageSize
      );

      return output(200, {
        status: "success",
        message: `Events for team ${input.params.teamId} fetched successfully`,
        data: list.map((e) => ({
          ...e,
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
          start_date: new Date(e.start_date),
          end_date: new Date(e.end_date),
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

  createEvent: RequestHandler = createExpressController(
    contract.api.v1.events.POST,
    async ({ input, output }) => {
      const imageFile = input.files?.thumbnail;

      const result = await this.eventController.createEvent({
        creatorId: input.body.data.creatorId,
        title: input.body.data.title,
        description: input.body.data.description,
        category: input.body.data.category,
        venue: input.body.data.venue,
        start_date: input.body.data.start_date.toISOString(),
        end_date: input.body.data.end_date.toISOString(),
        attendance_points: input.body.data.attendance_points,
        beviPreviewUrl: input.body.data.bevyPreviewUrl || undefined,
        image: imageFile ? {
          arrayBuffer: () => imageFile.arrayBuffer(),
          name: imageFile.name,
          type: imageFile.type,
        } as any : null,
        tags: input.body.data.tags,
        max_capacity: input.body.data.max_capacity,
        short_description: input.body.data.short_description || undefined,
        speakers: input.body.data.speakers,
        type: input.body.data.type || undefined,
        teamId: input.body.data.teamId || undefined,
      });

      return output(200, {
        status: "success",
        message: "Event created successfully",
        data: {
          ...result,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          start_date: new Date(result.start_date),
          end_date: new Date(result.end_date),
        },
      });
    }
  );

  getEventById: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.GET,
    async ({ input, output }) => {
      const result = await this.eventController.getOneEvent(input.params.eventId);

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data: {
          ...result,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          start_date: new Date(result.start_date),
          end_date: new Date(result.end_date),
        },
      });
    }
  );

  updateEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.PATCH,
    async ({ input, output }) => {
      const result = await this.eventController.updateEvent(input.params.eventId, {
        ...input.body.data,
        start_date: input.body.data.start_date,
        end_date: input.body.data.end_date,
      });

      return output(200, {
        status: "success",
        message: "Event updated successfully",
        data: {
          ...result,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
          start_date: new Date(result.start_date),
          end_date: new Date(result.end_date),
        },
      });
    }
  );

  deleteEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.DELETE,
    async ({ input, output }) => {
      await this.eventController.deleteEvent(input.params.eventId);
      
      return output(200, {
        status: "success",
        message: "Event deleted successfully",
      });
    }
  );
}
