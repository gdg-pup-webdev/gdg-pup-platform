import { Router } from "express";
import { ProjectsHttpController } from "./project.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class ProjectsRouter {
  router: Router;

  constructor(
    private projectController: ProjectsHttpController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.projectController.listUserProjects);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.projectController.createProject,
    );

    this.router.get("/:projectId", this.projectController.getOneProject);

    this.router.delete(
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.projectController.deleteProject,
    );

    this.router.patch(
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.projectController.updateProject,
    );
  }
}
