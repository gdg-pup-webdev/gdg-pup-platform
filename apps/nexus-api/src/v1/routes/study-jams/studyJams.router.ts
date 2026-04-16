import { Router } from "express";
import { StudyJamsHttpController } from "./studyJams.controller";

export class StudyJamsRouter {
  router: Router;

  constructor(private readonly controller: StudyJamsHttpController) {
    this.router = Router();

    this.router.get("/", this.controller.listStudyJams);
    this.router.post("/", this.controller.createStudyJam);
    this.router.get("/:studyJamId", this.controller.getOneStudyJam);
    this.router.patch("/:studyJamId", this.controller.updateStudyJam);
    this.router.delete("/:studyJamId", this.controller.deleteStudyJam);
  }
}
