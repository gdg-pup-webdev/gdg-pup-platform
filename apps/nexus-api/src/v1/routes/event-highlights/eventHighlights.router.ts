import { Router } from "express";
import { EventHighlightsHttpController } from "./eventHighlights.controller";

export class EventHighlightsRouter {
  router: Router;

  constructor(private readonly controller: EventHighlightsHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.getList);
    this.router.post("/", this.controller.postCreate);

    this.router.get("/:id", this.controller.getOne);
    this.router.patch("/:id", this.controller.patchUpdate);
    this.router.delete("/:id", this.controller.deleteItem);
  }
}
