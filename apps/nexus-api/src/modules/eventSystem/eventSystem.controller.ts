import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "./attendance.service.js";
import { ServerError } from "../../classes/ServerError.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";

export class EventSystemController {
  constructor(
    private eventService: EventService = eventServiceInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance
  ) {}

  /**
   * Vanilla express example
   */
  list: RequestHandler = createExpressController(
    contract.api.event_system.events.GET,
    async ({ input, output, ctx }) => {
      const { data, error } = await this.eventService.list();
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: data.listData,
        meta: {
          totalRecords: data.count,
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
          totalPages: Math.ceil(data.count / input.query.page.size),
        },
      });
    }
  );

  /**
   * EXAMPLE USING createExpressController when creating event
   * no need to validate and parse input manually
   */
  create: RequestHandler = createExpressController(
    contract.api.event_system.events.POST,
    async ({ input, output, ctx }) => {
      const { req, res } = ctx;
      const user = req.user!;
      const userId = user.id; // user id from token parser

      const dto = input.body.data;

      const { data, error } = await this.eventService.create(dto, userId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Event created successfully",
        data,
      });
    }
  );

  /**
   * EXAMPLE USING createExpressController
   * fully typed input object contaning params, query, body
   * fully typed output function to send response
   */
  update: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.PATCH,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;
      const dto = input.body.data;

      const { data, error } = await this.eventService.update(eventId, dto);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }
      return output(200, {
        status: "success",
        message: "Event updated successfully",
        data,
      });
    }
  );

  delete: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.DELETE,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;

      const { data, error } = await this.eventService.delete(eventId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Event deleted successfully",
        data,
      });
    }
  );

  getOne: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.GET,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;

      const { data, error } = await this.eventService.getById(eventId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data,
      });
    }
  );

  checkin: RequestHandler = createExpressController(
    contract.api.event_system.checkin.POST,
    async ({ input, output, ctx }) => {
      const { req, res } = ctx;
      const user = req.user!;
      // const userId = user.id; // user id from token parser

      const body = input.body;
      const { eventId, checkinMethod, attendeeId } = body.data;

      const { data, error } = await this.eventService.checkInToEvent(
        eventId,
        attendeeId,
        checkinMethod
      );
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Attendee checked in successfully",
        data: data.attendance,
      });
    }
  );

  listEventAttendees: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.attendees.GET,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId as string;
      const { data, error } =
        await this.attendanceService.listEventAttendees(eventId);
      if (error) {
        throw ServerError.internalError(
          `Something went wrong: ${error.message}`
        );
      }

      return output(200, {
        status: "success",
        message: "Attendees fetched successfully",
        data: data.listData,
        meta: {
          totalRecords: data.count,
          currentPage: input.query.page.number,
          pageSize: input.query.page.size,
          totalPages: Math.ceil(data.count / input.query.page.size),
        },
      });
    }
  );
}

export const eventSystemControllerInstance = new EventSystemController();
