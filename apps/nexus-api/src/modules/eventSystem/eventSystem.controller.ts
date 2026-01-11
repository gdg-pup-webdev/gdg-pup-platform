import { RequestHandler } from "express";
import { EventService, eventServiceInstance } from "./event.service.js";
import {
  AttendanceService,
  attendanceServiceInstance,
} from "./attendance.service.js";

export class EventSystemController {
  constructor(
    private eventService: EventService = eventServiceInstance,
    private attendanceService: AttendanceService = attendanceServiceInstance
  ) {}

  list: RequestHandler = async (req, res) => {
    const { data, error } = await this.eventService.list();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  create: RequestHandler = async (req, res) => {
    const user = req.user!;
    const userId = user.id; // user id from token parser

    const dto = req.body;
    const { data, error } = await this.eventService.create(dto, userId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  delete: RequestHandler = async (req, res) => {};

  update: RequestHandler = async (req, res) => {};

  getOne: RequestHandler = async (req, res) => {};

  checkin: RequestHandler = async (req, res) => {
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
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };

  listEventAttendees: RequestHandler = async (req, res) => {
    const eventId = req.params.eventId as string;
    const { data, error } =
      await this.attendanceService.listEventAttendees(eventId);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ data });
  };
}

export const eventSystemControllerInstance = new EventSystemController();
