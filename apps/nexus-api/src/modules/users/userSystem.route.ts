import { Router } from "express";
import {
  UserSystemController,
  userSystemControllerInstance,
} from "./userSystem.controller.js";

export class UserSystemRouter {
  constructor(
    private userSystemController: UserSystemController = userSystemControllerInstance
  ) {}

  getRouter() {
    const router = Router();

    router.get("/:userId", this.userSystemController.getUserById);
    router.get("/:userId/wallet", (req, res) => {});
    router.get("/:userId/wallet/transactions", (req, res) => {});
    router.get("/:userId/roles", (req, res) => {});
    router.get("/:userId/profile", (req, res) => {});

    router.get("/:userId/projects", (req, res) => {});

    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
