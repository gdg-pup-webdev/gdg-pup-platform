import { Router } from "express";
import { StudyJamsHttpController } from "./studyJam.controller";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware";

export class StudyJamsRouter {
  router: Router;
  constructor(
    private readonly resourceSystemController: StudyJamsHttpController,
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.resourceSystemController.listStudyJams);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.createStudyJam,
    );

    this.router.delete(
      "/:studyJamId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.deleteStudyJam,
    );

    this.router.patch(
      "/:studyJamId",
      this.authMiddleware.requireAuth(),
      this.resourceSystemController.updateStudyJam,
    );

    this.router.get(
      "/:studyJamId",
      this.resourceSystemController.getOneStudyJam,
    );

    this.router.get("/:studyJamId/tags", (req, res) => {});
  }
}
