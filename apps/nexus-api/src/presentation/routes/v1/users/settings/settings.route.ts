/**
 * @file settings.route.ts
 * @description HTTP Routing configuration for User Settings.
 */

import { Router } from "express";
import {
  SettingsHttpController, 
} from "./settings.controller.js";
import {
  AuthMiddleware, 
} from "@/presentation/middlewares/auth.middleware.js";

export class SettingsRouter {
  router: Router;
  constructor(
    private settingsController: SettingsHttpController,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.settingsController.listUserSettings);

    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.settingsController.createSettings,
    );

    this.router.get("/:settingsId", this.settingsController.getOneSettings);

    this.router.delete(
      "/:settingsId",
      this.authMiddleware.requireAuth(),
      this.settingsController.deleteSettings,
    );

    this.router.patch(
      "/:settingsId",
      this.authMiddleware.requireAuth(),
      this.settingsController.updateSettings,
    );
  }
}
