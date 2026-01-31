import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import { AttendanceService, attendanceServiceInstance } from "../attendance/attendance.service.js";
import { ServiceError } from "@/classes/ServerError.js";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { tryCatch } from "@/utils/tryCatch.util.js";

/**
 * Controller for handling event-related HTTP requests.
 * Implements endpoints defined in the event system contract.
 */
export class EventController {
  constructor(
    private readonly eventService: EventService = eventServiceInstance,
    private readonly attendanceService: AttendanceService = attendanceServiceInstance,
  ) {}

  /**
   * Lists events with optional filtering and pagination.
   *
   * @route GET /api/event-system/events
   * @returns JSON response containing the list of events and pagination metadata.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  listEvents: RequestHandler = createExpressController(
    contract.api.event_system.events.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const filters = {
        creator_id: input.query.creator_id,
        category: input.query.category,
        venue: input.query.venue,
        start_date_gte: input.query.start_date_gte,
        start_date_lte: input.query.start_date_lte,
        end_date_gte: input.query.end_date_gte,
        end_date_lte: input.query.end_date_lte,
      };

      const { data, error } = await tryCatch(
        async () => await this.eventService.list(pageNumber, pageSize, filters),
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
   * Creates a new event.
   *
   * @route POST /api/event-system/events
   * @returns JSON response containing the created event.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  createEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.POST,
    async ({ input, output, ctx }) => {
      const { req } = ctx;
      const userId = req.user?.id;
      if (!userId) throw new ServiceError("User ID is required");

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
   * Updates an existing event.
   *
   * @route PATCH /api/event-system/events/:eventId
   * @returns JSON response containing the updated event.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  updateEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.PATCH,
    async ({ input, output }) => {
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

  /**
   * Deletes an event.
   *
   * @route DELETE /api/event-system/events/:eventId
   * @returns JSON response confirming deletion.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  delete: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.DELETE,
    async ({ input, output }) => {
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

  /**
   * Retrieves a single event by ID.
   *
   * @route GET /api/event-system/events/:eventId
   * @returns JSON response containing the event data.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  getOneEvent: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.GET,
    async ({ input, output }) => {
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

  /**
   * Checks a user into an event.
   *
   * @route POST /api/event-system/checkin
   * @returns JSON response containing attendance record.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  checkinToAnEvent: RequestHandler = createExpressController(
    contract.api.event_system.checkin.POST,
    async ({ input, output }) => {

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

  /**
   * Lists attendees for a specific event.
   *
   * @route GET /api/event-system/events/:eventId/attendees
   * @returns JSON response containing list of attendees.
   * @throws {ServiceError} If the service layer encounters an error.
   */
  listEventAttendees: RequestHandler = createExpressController(
    contract.api.event_system.events.eventId.attendees.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;
      const eventId = input.params.eventId;
      const filters = {
        event_id: eventId,
        user_id: input.query.user_id,
        checkin_method: input.query.checkin_method,
        is_present: input.query.is_present,
        created_at_gte: input.query.created_at_gte,
        created_at_lte: input.query.created_at_lte,
      };
      const { data, error } = await tryCatch(
        async () =>
          await this.attendanceService.listEventAttendees(pageNumber, pageSize, filters),
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
