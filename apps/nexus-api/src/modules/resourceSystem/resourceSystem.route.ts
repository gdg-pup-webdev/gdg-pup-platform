import { Router } from "express";
import {
  ResourceSystemController,
  resourceSystemControllerInstance,
} from "./resourceSystem.controller.js";

export class ResourceSystemRouter {
  constructor(
    private readonly resourceSystemController: ResourceSystemController = resourceSystemControllerInstance
  ) {}

  getRouter() {
    const router = Router();

    router.get("/resources", this.resourceSystemController.list);
    router.post("/resources", this.resourceSystemController.create);
    router.delete(
      "/resources/:resourceId",
      this.resourceSystemController.delete
    );
    router.patch("/resources/:resourceId", this.resourceSystemController.update);
    router.get("/resources/:resourceId", this.resourceSystemController.getOne);

    router.get("/resources/:resourceId/tags", (req, res) => {});

    return router;
  }
}

export const resourceSystemRouterInstance = new ResourceSystemRouter();
