import { Router } from "express";
import { EventHighlightsHttpController } from "./eventHighlights.controller";

export class EventHighlightsRouter {
  router: Router;

  constructor(private readonly controller: EventHighlightsHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.listHighlights);
    this.router.post("/", this.controller.createHighlight);

    this.router.get("/:id", this.controller.getOneHighlight);
    this.router.patch("/:id", this.controller.updateHighlight);
    this.router.delete("/:id", this.controller.deleteHighlight);
  }
}
