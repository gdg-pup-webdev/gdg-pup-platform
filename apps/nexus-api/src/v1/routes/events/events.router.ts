import { Router } from "express";
import { EventsHttpController } from "./events.controller";

export class EventsRouter {
  router: Router;

  constructor(private readonly eventsHttpController: EventsHttpController) {
    this.router = Router();

    this.router.get("/", this.eventsHttpController.listEvents);
    this.router.post("/", this.eventsHttpController.createEvent);
    this.router.post("/from-bevy-event", this.eventsHttpController.createFromBevy);

    this.router.get("/:eventId", this.eventsHttpController.getOne);
    this.router.patch("/:eventId", this.eventsHttpController.updateEvent);
    this.router.delete("/:eventId", this.eventsHttpController.deleteEvent);

    this.router.get("/:eventId/attendees", this.eventsHttpController.listAttendees);
    this.router.post("/:eventId/attendees", this.eventsHttpController.checkin);
  }
}
