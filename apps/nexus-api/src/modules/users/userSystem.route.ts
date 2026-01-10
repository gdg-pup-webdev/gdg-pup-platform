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
    router.get("/:userId/wallet", this.userSystemController.getUserWallet);
    router.get(
      "/:userId/wallet/transactions",
      this.userSystemController.listUserWalletTransactions
    );
    router.get("/:userId/roles", this.userSystemController.listUserRoles);
    router.get("/:userId/profile", this.userSystemController.getUserProfile);

    router.get("/:userId/projects", this.userSystemController.listUserProjects);

    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
