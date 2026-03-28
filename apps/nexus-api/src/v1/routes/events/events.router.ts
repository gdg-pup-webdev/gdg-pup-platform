import { Router } from "express";
import { EventsHttpController } from "./events.controller";
import { eventSystemController } from "@/v1/modules/eventSystem";

const router = Router();
const controller = new EventsHttpController(eventSystemController);

router.get("/", controller.listEvents);
router.post("/", controller.createEvent);
router.get("/by-type/:type", controller.getEventsByType);
router.get("/by-team/:teamId", controller.getEventsByTeam);
router.get("/:eventId", controller.getEventById);
router.patch("/:eventId", controller.updateEvent);
router.delete("/:eventId", controller.deleteEvent);

export class EventsRouter {
  router: Router;

  constructor(private controller: EventsHttpController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.controller.listEvents);
    this.router.post("/", this.controller.createEvent);
    this.router.get("/by-type/:type", this.controller.getEventsByType);
    this.router.get("/by-team/:teamId", this.controller.getEventsByTeam);
    this.router.get("/:eventId", this.controller.getEventById);
    this.router.patch("/:eventId", this.controller.updateEvent);
    this.router.delete("/:eventId", this.controller.deleteEvent);
  }
}

export default router;
