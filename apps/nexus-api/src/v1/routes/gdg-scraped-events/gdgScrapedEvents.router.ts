import { Router } from "express";
import { GdgScrapedEventsHttpController } from "./gdgScrapedEvents.controller";

export class GdgScrapedEventsRouter {
  router: Router;

  constructor(
    private gdgScrapedEventsHttpController: GdgScrapedEventsHttpController,
  ) {
    this.router = Router();

    this.router.get("/", this.gdgScrapedEventsHttpController.list);
  }
}
