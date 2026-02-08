import { Router } from "express";
import {
  ExternalResourceController,
  externalResourceControllerInstance,
} from "./externalResource.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../../middlewares/auth.middleware.js";

export class ExternalResourceRouter {
  constructor(
    private readonly resourceSystemController: ExternalResourceController = externalResourceControllerInstance,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.resourceSystemController.listExternalResources);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.createExternalResource,
    );

    router.delete(
      "/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.deleteExternalResource,
    );

    router.patch(
      "/:externalResourceId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.updateExternalResource,
    );

    router.get(
      "/:externalResourceId",
      this.resourceSystemController.getOneExternalResource,
    );

    router.get("/:externalResourceId/tags", (req, res) => {});

    return router;
  }
}

export const externalResourceRouterInstance = new ExternalResourceRouter();
