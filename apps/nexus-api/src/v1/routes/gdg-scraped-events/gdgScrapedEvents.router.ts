import { Router } from "express";
import { GdgScrapedEventsHttpController } from "./gdgScrapedEvents.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";

export class GdgScrapedEventsRouter {
  router: Router;

  constructor(
    private gdgScrapedEventsHttpController: GdgScrapedEventsHttpController,
  ) {
    this.router = Router();

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      "gdg_scraped_events": ["queries", "mutations"],
    }))

    this.router.get("/", this.gdgScrapedEventsHttpController.list);
    this.router.get("/:gdg_id", this.gdgScrapedEventsHttpController.getOne);
    this.router.post("/sync", this.gdgScrapedEventsHttpController.sync);
  }
}
