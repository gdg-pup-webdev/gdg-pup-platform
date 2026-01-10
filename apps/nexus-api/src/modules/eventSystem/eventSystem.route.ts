import { Router } from "express";
import {
  EventSystemController,
  eventSystemControllerInstance,
} from "./eventSystem.controller.js";

export class EventSystemRouter {
  constructor(
    private eventSystemController: EventSystemController = eventSystemControllerInstance
  ) {}

  getRouter() {
    const router = Router();

    router.get("/events", this.eventSystemController.list);
    router.post("/events", this.eventSystemController.create);
    router.delete("/events/:eventId", this.eventSystemController.delete);
    router.put("/events/:eventId", this.eventSystemController.update);
    router.get(
      "/events/:eventId/attendees",
      this.eventSystemController.listEventAttendees
    );

    router.post("/checkin", this.eventSystemController.checkin);

    return router;
  }
}

export const eventSystemRouterInstance = new EventSystemRouter();
