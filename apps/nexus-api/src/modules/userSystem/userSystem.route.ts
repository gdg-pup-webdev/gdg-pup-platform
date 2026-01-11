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

    router.get("/users/:userId", this.userSystemController.getUserById);

    router.get("/users/:userId/wallet", this.userSystemController.getUserWallet);

    router.get(
      "/users/:userId/wallet/transactions",
      this.userSystemController.listUserWalletTransactions
    );

    router.get("/users/:userId/roles", this.userSystemController.listUserRoles);

    router.get(
      "/users/:userId/profile",
      this.userSystemController.getUserProfile
    );

    router.get(
      "/users/:userId/projects",
      this.userSystemController.listUserProjects
    );

    return router;
  }
}

export const userSystemRouterInstance = new UserSystemRouter();
