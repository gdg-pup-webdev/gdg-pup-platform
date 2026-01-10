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

    router.delete("/projects/:projectId", (req, res) => {});

    router.patch("/projects/:projectId", (req, res) => {});

    return router;
  }
}

export const userResourceSystemRouterInstance = new UserResourceSystemRouter();
