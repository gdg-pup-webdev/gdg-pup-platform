import { Router } from "express";
import {
  UserSystemController,
  userSystemControllerInstance,
} from "./user.controller.js";

export class UserRouter {
  constructor(
    private readonly userSystemController: UserSystemController = userSystemControllerInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.userSystemController.listUsers);

    router.get("/:userId", this.userSystemController.getUserById);

    router.get(
      "/:userId/aggregate",
      this.userSystemController.getUserAggregate,
    );

    return router;
  }
}

export const userRouterInstance = new UserRouter();
