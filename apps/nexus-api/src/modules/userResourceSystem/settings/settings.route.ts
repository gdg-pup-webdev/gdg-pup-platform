/**
 * @file settings.route.ts
 * @description HTTP Routing configuration for User Settings.
 */

import { Router } from "express";
import {
  SettingsController,
  settingsControllerInstance,
} from "./settings.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";

export class SettingsRouter {
  constructor(
    private settingsController: SettingsController = settingsControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.settingsController.listUserSettings);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.settingsController.createSettings,
    );

    router.get("/:settingsId", this.settingsController.getOneSettings);

    router.delete(
      "/:settingsId",
      this.authMiddleware.requireAuth(),
      this.settingsController.deleteSettings,
    );

    router.patch(
      "/:settingsId",
      this.authMiddleware.requireAuth(),
      this.settingsController.updateSettings,
    );

    return router;
  }
}

export const settingsRouterInstance = new SettingsRouter();
