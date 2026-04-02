import { Router } from "express";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/v1/middlewares/auth.middleware";
import { StudyJamsHttpController } from "./studyJams.controller";

export class StudyJamsRouter {
  router: Router;

  constructor(
    private readonly controller: StudyJamsHttpController,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {
    this.router = Router();

    this.router.get("/", this.controller.listStudyJams);
    this.router.post(
      "/",
      this.authMiddleware.requirePermissions({ "study-jams": ["create"] }),
      this.controller.createStudyJam,
    );
    this.router.get("/:studyJamId", this.controller.getOneStudyJam);
    this.router.patch(
      "/:studyJamId",
      this.authMiddleware.requirePermissions({ "study-jams": ["update"] }),
      this.controller.updateStudyJam,
    );
    this.router.delete(
      "/:studyJamId",
      this.authMiddleware.requirePermissions({ "study-jams": ["delete"] }),
      this.controller.deleteStudyJam,
    );
  }
}
