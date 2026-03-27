import { RequestHandler } from "express";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { contract } from "@packages/nexus-api-contracts";
import { EventSystemController } from "@/v1/modules/eventSystem";
import { Event } from "@/v1/modules/eventSystem/domain/Event";

export class EventsHttpController {
  constructor(private readonly eventSystemController: EventSystemController) {} 


  listEvents: RequestHandler = createExpressController(
    contract.api.v1.events.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const year = input.query.year || null;

      let list, count;
      if (year) { 
        const res = await this.eventSystemController.listEventsByYear(
          pageNumber,
          pageSize,
          year,
        );
        list = res.list;
        count = res.count;
      } else {
        const res = await this.eventSystemController.listEvents(
          pageNumber,
          pageSize,
        );
        list = res.list;
        count = res.count;
      }

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: list.map((e) => ({
          ...e,
          creator_id: e.creatorId,
          created_at: e.createdAt,
          updated_at: e.updatedAt,
          bevy_event_url: e.bevyPreviewUrl,

        })),
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
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const creatorId = req.user?.id || "anonymous";

      const image = input.files.thumbnail || null;

      console.log("Received image file:", image);

      const result = await this.eventSystemController.createEvent({
        creatorId,
        title: input.body.data.title,
        description: input.body.data.description || "",
        category: input.body.data.category || "",
        venue: input.body.data.venue || "",
        start_date: input.body.data.start_date || new Date().toISOString(),
        end_date: input.body.data.end_date || new Date().toISOString(),
        attendance_points: input.body.data.attendance_points,
        image: image,
      });

      return output(200, {
        status: "success",
        message: "Event created successfully",
        data: {
          ...result,
          creator_id: result.creatorId,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          bevy_event_url: result.bevyPreviewUrl  ,
        },
      });
    },
  );

  getOne: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.GET,
    async ({ input, output }) => {
      const result = await this.eventSystemController.getOneEvent(
        input.params.eventId,
      );

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data: {
          ...result,
          creator_id: result.creatorId,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          bevy_event_url: result.bevyPreviewUrl ,
        },
      });
    },
  );

  updateEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.PATCH,
    async ({ input, output }) => {
      const result = await this.eventSystemController.updateEvent(
        input.params.eventId,
        {
          title: input.body.data.title,
          description: input.body.data.description ?? undefined,
          category: input.body.data.category ?? undefined,
          venue: input.body.data.venue ?? undefined,
          start_date: input.body.data.start_date
            ? new Date(input.body.data.start_date)
            : undefined,
          end_date: input.body.data.end_date
            ? new Date(input.body.data.end_date)
            : undefined,
          attendance_points: input.body.data.attendance_points,
        },
      );

      return output(200, {
        status: "success",
        message: "Event updated successfully",
        data: {
          ...result,
          creator_id: result.creatorId,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          bevy_event_url: result.bevyPreviewUrl  ,
        },
      });
    },
  );

  deleteEvent: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.DELETE,
    async ({ input, output }) => {
      await this.eventSystemController.deleteEvent(input.params.eventId);

      return output(200, {
        status: "success",
        message: "Event deleted successfully",
      });
    },
  );

  checkin: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.attendees.POST,
    async ({ input, output }) => {
      const result = await this.eventSystemController.checkinToEvent(
        input.params.eventId,
        input.body.data.attendeeId,
        input.body.data.checkinMethod,
      );

      return output(200, {
        status: "success",
        message: "Check-in successful",
        data: {
          id: result.eventId + "_" + result.userId, // Fake ID for row
          event_id: result.eventId,
          user_id: result.userId,
          checkin_method: result.checkInMethod,
          is_present: true,
          created_at: result.checkedInAt,
        },
      });
    },
  );

  listAttendees: RequestHandler = createExpressController(
    contract.api.v1.events.eventId.attendees.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber || 1;
      const pageSize = input.query.pageSize || 10;

      const { list, count } =
        await this.eventSystemController.listEventAttendees(
          pageNumber,
          pageSize,
          input.params.eventId,
        );

      return output(200, {
        status: "success",
        message: "Attendees fetched successfully",
        data: list.map((a) => ({
          id: a.id,
          event_id: a.eventId,
          user_id: a.userId,
          checkin_method: a.checkInMethod,
          is_present: true,
          created_at: a.checkedInAt,
        })),
        meta: {
          totalRecords: count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(count / pageSize),
        },
      });
    },
  );

  createFromBevy: RequestHandler = createExpressController(
    contract.api.v1.events.from_bevy_event.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const creatorId = req.user?.id || "anonymous";

      const result = await this.eventSystemController.createEventFromBevyEvent(
        input.body.bevy_event_id,
        creatorId,
      );

      return output(201, {
        status: "success",
        message: "Event created from Bevy successfully",
        data: {
          ...result,
          creator_id: result.creatorId,
          created_at: result.createdAt,
          updated_at: result.updatedAt,
          bevy_event_url: result.bevyPreviewUrl ,
        },
      });
    },
  );
}
