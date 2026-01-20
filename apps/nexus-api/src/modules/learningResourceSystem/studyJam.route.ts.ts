import { Router } from "express";
import {
  StudyJamController,
  studyJamControllerInstance,
} from "./studyJam.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../middlewares/auth.middleware.js";

export class StudyJamRouter {
  constructor(
    private readonly resourceSystemController: StudyJamController = studyJamControllerInstance,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get(
      "/",
      this.resourceSystemController.listStudyJams,
    );

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.createStudyJam,
    );

    router.delete(
      "/:studyJamId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.deleteStudyJam,
    );

    router.patch(
      "/:studyJamId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.updateStudyJam,
    );

    router.get(
      "/:studyJamId",
      this.resourceSystemController.getOneStudyJam,
    );

    router.get(
      "/:studyJamId/tags",
      (req, res) => {},
    );

    return router;
  }
}

export const studyJamRouterInstance =
  new StudyJamRouter();
