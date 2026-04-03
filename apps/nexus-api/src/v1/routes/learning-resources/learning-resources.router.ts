import { Router } from "express";
import { LearningResourcesHttpController } from "./learning-resources.controller";

export class LearningResourcesRouter {
  router: Router;

  constructor(private controller: LearningResourcesHttpController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.controller.listResources);
    this.router.post("/", this.controller.createResource);
    this.router.get("/:learningResourceId", this.controller.getResourceById);
    this.router.patch("/:learningResourceId", this.controller.updateResource);
    this.router.delete("/:learningResourceId", this.controller.deleteResource);
  }
}
