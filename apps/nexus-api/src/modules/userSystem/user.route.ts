import { Router } from "express";
import {
  UserSystemController,
  userSystemControllerInstance,
} from "./user.controller.js";

export class UserRouter {
  constructor(
    private userSystemController: UserSystemController = userSystemControllerInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.userSystemController.listUsers);
    // router.get("/", (req,res) => res.status(200).json({data: "hello"}));

    router.get("/:userId", this.userSystemController.getUserById);
    // router.get("/:userId", (req,res) => res.status(200).json({data: "helafafasdslo"}));

    router.get(
      "/:userId/aggregate",
      this.userSystemController.getUserAggregate,
    );

    return router;
  }
}

export const userRouterInstance = new UserRouter();
