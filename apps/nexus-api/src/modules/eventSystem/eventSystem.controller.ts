import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "./attendance.service.js";
import { ServerError } from "../../classes/ServerError.js";

export class EventSystemController {
  constructor(
    private eventService: EventService = eventServiceInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance
  ) {}

  list: RequestHandler = async (req, res, next) => {
    try {
      const { data } = await this.eventService.list();
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };

  create: RequestHandler = async (req, res, next) => {
    const user = req.user!;
    const userId = user.id; // user id from token parser

    const dto = req.body;
    try {
      const { data } = await this.eventService.create(dto, userId);
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    const eventId = req.params.eventId as string;
    try {
      const { data } = await this.eventService.delete(eventId);
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };

  update: RequestHandler = async (req, res, next) => {
    const eventId = req.params.eventId as string;
    const dto = req.body;
    try {
      const { data } = await this.eventService.update(eventId, dto);
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };

  getOne: RequestHandler = async (req, res) => {};

  checkin: RequestHandler = async (req, res, next) => {
    const user = req.user!;
    // const userId = user.id; // user id from token parser

    const body = req.body;
    const { eventId, checkinMethod, userId } = body;

    try {
      const { data } = await this.eventService.checkInToEvent(
        eventId,
        userId,
        checkinMethod
      );
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };

  listEventAttendees: RequestHandler = async (req, res, next) => {
    const eventId = req.params.eventId as string;
    try {
      const { data } = await this.attendanceService.listEventAttendees(eventId);
      return res.status(200).json({ data });
    } catch (error: any) {
      if (error instanceof ServerError) {
        return res
          .status(error.statusCode)
          .json({ error: error.message, title: error.title });
      }
      return next(error);
    }
  };
}

export const eventSystemControllerInstance = new EventSystemController();
