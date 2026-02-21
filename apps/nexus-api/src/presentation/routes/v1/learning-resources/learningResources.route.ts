import { Router } from "express";
import { LearningResourcesHttpController } from "./learningResources.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class LearningResourcesRouter {
  router: Router;

  constructor(
    private readonly resourceSystemController: LearningResourcesHttpController,
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.resourceSystemController.listExternalResources);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.createExternalResource,
    );

    this.router.delete(
      "/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.deleteExternalResource,
    );

    this.router.patch(
      "/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.updateExternalResource,
    );

    this.router.get(
      "/:externalResourceId",
      this.resourceSystemController.getOneExternalResource,
    );

    this.router.get("/:externalResourceId/tags", (req, res) => {});
  }
}
