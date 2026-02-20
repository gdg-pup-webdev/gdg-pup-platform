import { Router } from "express";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";
import { EventsHttpController } from "./event.controller.js";

export class EventsRouter {
  router: Router;
  constructor(
    private eventSystemController: EventsHttpController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.eventSystemController.listEvents);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.createEvent,
      // (req, res) => res.status(200).json({ message: "not implemented" })
    );

    this.router.get("/:eventId", this.eventSystemController.getOneEvent);

    this.router.delete(
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.delete,
    );

    this.router.patch(
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.updateEvent,
    );

    this.router.get(
      "/:eventId/attendees",
      this.eventSystemController.listEventAttendees,
    );

    this.router.post(
      "/checkin",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.checkinToAnEvent,
    );
  }
}
