import { Router } from "express";
import {
  UserResourceSystemController,
  userResourceSystemControllerInstance,
} from "./userResourceSystem.controller.js";

export class UserResourceSystemRouter {
  constructor(
    private userResourceSystemController: UserResourceSystemController = userResourceSystemControllerInstance
  ) {}

  getRouter() {
    const router = Router();

    router.get("/projects", (req, res) => {});

    router.post("/projects", this.userResourceSystemController.createProject);

    router.get(
      "/projects/:projectId",
      this.userResourceSystemController.getOneProject
    );

    router.delete(
      "/projects/:projectId",
      this.userResourceSystemController.deleteProject
    );

    router.patch(
      "/projects/:projectId",
      this.userResourceSystemController.updateProject
    );

    return router;
  }
}

export const userResourceSystemRouterInstance = new UserResourceSystemRouter();
