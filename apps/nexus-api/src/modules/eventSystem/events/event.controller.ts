import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "../attendance/attendance.service.js";
import {
  RepositoryError,
  ServerError,
  ServiceError,
} from "../../../classes/ServerError.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class EventController {
  constructor(
    private eventService: EventService = eventServiceInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance,
  ) {}

  /**
   * Vanilla express example
   */
  listEvents: RequestHandler = createExpressController(
    contract.api.event_system.events.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      const { data, error } = await tryCatch(
        async () => await this.eventService.list(),
        "listing events",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Events fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );

  /**
   * EXAMPLE USING createExpressController when creating event
   * no need to validate and parse input manually
   */
  createEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.POST,
    async ({ input, output, ctx }) => {
      const { req, res } = ctx;
      const user = req.user!;
      const userId = user.id; // user id from token parser

      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.eventService.create(dto, userId),
        "creating event",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Event created successfully",
        data,
      });
    },
  );

  /**
   * EXAMPLE USING createExpressController
   * fully typed input object contaning params, query, body
   * fully typed output function to send response
   */
  updateEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.PATCH,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;
      const dto = input.body.data;

      const { data, error } = await tryCatch(
        async () => await this.eventService.update(eventId, dto),
        "updating event",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Event updated successfully",
        data,
      });
    },
  );

  delete: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.DELETE,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;

      const { data, error } = await tryCatch(
        async () => await this.eventService.delete(eventId),
        "deleting event",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Event deleted successfully",
        data,
      });
    },
  );

  getOneEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.GET,
    async ({ input, output, ctx }) => {
      const eventId = input.params.eventId;

      const { data, error } = await tryCatch(
        async () => await this.eventService.getById(eventId),
        "getting event by id",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Event fetched successfully",
        data,
      });
    },
  );

  checkinToAnEvent: RequestHandler = createExpressController(
    contract.api.event_system.checkin.POST,
    async ({ input, output, ctx }) => {
      const { req, res } = ctx;
      const user = req.user!;
      // const userId = user.id; // user id from token parser

      const body = input.body;
      const { eventId, checkinMethod, attendeeId } = body.data;

      const { data, error } = await tryCatch(
        async () =>
          await this.eventService.checkInToEvent(
            eventId,
            attendeeId,
            checkinMethod,
          ),
        "checking in to event",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Attendee checked in successfully",
        data: data.attendance,
      });
    },
  );

  listEventAttendees: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.attendees.GET,
    async ({ input, output, ctx }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const eventId = input.params.eventId as string;
      const { data, error } = await tryCatch(
        async () => await this.attendanceService.listEventAttendees(eventId),
        "listing event attendees",
      );
      if (error) throw new ServiceError(error.message);

      return output(200, {
        status: "success",
        message: "Attendees fetched successfully",
        data: data.list,
        meta: {
          totalRecords: data.count,
          currentPage: pageNumber,
          pageSize,
          totalPages: Math.ceil(data.count / pageSize),
        },
      });
    },
  );
}

export const eventControllerInstance = new EventController();
