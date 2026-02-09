import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";
import {
  EventController,
  eventControllerInstance,
} from "./event.controller.js";

export class EventRouter {
  constructor(
    private eventSystemController: EventController = eventControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.eventSystemController.listEvents);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.createEvent,
      // (req, res) => res.status(200).json({ message: "not implemented" })
    );

    router.get("/:eventId", this.eventSystemController.getOneEvent);

    router.delete(
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.delete,
    );

    router.patch(
      "/:eventId",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.updateEvent,
    );

    router.get(
      "/:eventId/attendees",
      this.eventSystemController.listEventAttendees,
    );

    router.post(
      "/checkin",
      this.authMiddleware.requireAuth(),
      this.eventSystemController.checkinToAnEvent,
    );

    return router;
  }
}

export const eventRouterInstance = new EventRouter();
