import { Router } from "express";
import {
  ProjectController,
  projectControllerInstance,
} from "./project.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";

export class ProjectRouter {
  constructor(
    private projectController: ProjectController = projectControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.projectController.listUserProjects);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.projectController.createProject,
    );

    router.get("/:projectId", this.projectController.getOneProject);

    router.delete(
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.projectController.deleteProject,
    );

    router.patch(
      "/:projectId",
      this.authMiddleware.requireAuth(),
      this.projectController.updateProject,
    );

    return router;
  }
}

export const projectRotuerInstance = new ProjectRouter();
