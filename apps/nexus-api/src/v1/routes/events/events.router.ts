import { Router } from "express";
import { EventsHttpController } from "./events.controller";
import { eventSystemController } from "@/v1/modules/eventSystem";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";
 
export class EventsRouter {
  router: Router;

  constructor(private controller: EventsHttpController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * PUBLIC ROUTES
     */
    this.router.get("/", this.controller.listEvents);
    this.router.get("/:eventId", this.controller.getEventById);
    this.router.get("/by-type/:type", this.controller.getEventsByType);
    this.router.get("/by-team/:teamId", this.controller.getEventsByTeam);
    this.router.get("/:eventId", this.controller.getEventById);

    /**
     * PROTECTED ROUTES 
     */
    this.router.use(requirePermissions({
      "events": ["mutations"],
    }))

    this.router.post("/", this.controller.createEvent);
    this.router.post("/syncAllToBevy", this.controller.syncAllEventToBevy);
    this.router.post("/:eventId/syncToBevy", this.controller.syncOneEventToBevy);
    this.router.post("/:eventId/images", this.controller.postAddImage);
    this.router.patch("/:eventId/images/reorder", this.controller.patchReorderImages);
    this.router.delete("/:eventId/images/:imageIndex", this.controller.deleteImage);
    this.router.patch("/:eventId", this.controller.updateEvent);
    this.router.delete("/:eventId", this.controller.deleteEvent);
  }
}
 