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

    router.post("/projects", this.userResourceSystemController.create);

    router.get(
      "/projects/:projectId",
      this.userResourceSystemController.getOne
    );

    router.delete(
      "/projects/:projectId",
      this.userResourceSystemController.delete
    );

    router.patch(
      "/projects/:projectId",
      this.userResourceSystemController.update
    );

    return router;
  }
}

export const userResourceSystemRouterInstance = new UserResourceSystemRouter();
