import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";
import {
  ExternalResourceController,
  externalResourceControllerInstance,
} from "./externalResource.controller.js";
import {
  StudyJamController,
  studyJamControllerInstance,
} from "./studyJam.controller.js";
import {
  ExternalResourceRouter,
  externalResourceRouterInstance,
} from "./externalResource.route.js";
import { StudyJamRouter, studyJamRouterInstance } from "./studyJam.route.ts.js";

export class LearningResourceSystemRouter {
  constructor(
    private readonly externalResourcesRouter: ExternalResourceRouter = externalResourceRouterInstance,
    private readonly studyJamRouter: StudyJamRouter = studyJamRouterInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.use("/external-resources", this.externalResourcesRouter.getRouter());

    router.use("/study-jams", this.studyJamRouter.getRouter());

    return router;
  }
}

export const learningResourceSystemRouterInstance =
  new LearningResourceSystemRouter();
