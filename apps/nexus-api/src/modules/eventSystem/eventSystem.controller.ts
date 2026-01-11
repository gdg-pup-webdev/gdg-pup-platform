import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "./attendance.service.js";
import { ServerError } from "../../classes/ServerError.js";
import { createExpressController } from "@packages/api-typing";
import { Contract } from "@packages/nexus-api-contracts";

export class EventSystemController {
  constructor(
    private eventService: EventService = eventServiceInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance
  ) {}

  /**
   * Vanilla express example
   */
  list: RequestHandler = async (req, res, next) => {
    const { data, error } = await this.eventService.list();
    if (error) {
      throw ServerError.internalError(`Something went wrong: ${error.message}`);
    }

    return res.status(200).json({ data });
  };

  /**
   * EXAMPLE USING createExpressController when creating event
   * no need to validate and parse input manually
   */
  create: RequestHandler = createExpressController(
    Contract.eventSystem.events.post,
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
    Contract.eventSystem.events.event.patch,
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

  delete: RequestHandler = async (req, res, next) => {
    const eventId = req.params.eventId as string;

    const { data, error } = await this.eventService.delete(eventId);
    if (error) {
      throw ServerError.internalError(`Something went wrong: ${error.message}`);
    }
    return res.status(200).json({ data });
  };

  getOne: RequestHandler = async (req, res) => {};

  checkin: RequestHandler = async (req, res, next) => {
    const user = req.user!;
    // const userId = user.id; // user id from token parser

    const body = req.body;
    const { eventId, checkinMethod, userId } = body;

    const { data, error } = await this.eventService.checkInToEvent(
      eventId,
      userId,
      checkinMethod
    );
    if (error) {
      throw ServerError.internalError(`Something went wrong: ${error.message}`);
    }
    return res.status(200).json({ data });
  };

  listEventAttendees: RequestHandler = async (req, res, next) => {
    const eventId = req.params.eventId as string;
    const { data, error } =
      await this.attendanceService.listEventAttendees(eventId);
    if (error) {
      throw ServerError.internalError(`Something went wrong: ${error.message}`);
    }
    return res.status(200).json({ data });
  };
}

export const eventSystemControllerInstance = new EventSystemController();
