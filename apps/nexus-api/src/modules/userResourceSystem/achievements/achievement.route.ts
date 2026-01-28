/**
 * @file achievement.route.ts
 * @description Defines the HTTP routes for Achievement management. 
 * Integrates with authentication middleware to protect write operations.
 */

import { Router } from "express";
import {
  AchievementController,
  achievementControllerInstance,
} from "./achievement.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "../../../middlewares/auth.middleware.js";

export class AchievementRouter {
  constructor(
    private achievementController: AchievementController = achievementControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  /**
   * getRouter
   * Returns a configured Express Router for achievement endpoints.
   */
  getRouter() {
    const router: Router = Router();

    /** Publicly list achievements or filter by user */
    router.get("/", this.achievementController.listUserAchievements);

    /** Create a new achievement (Requires Authentication) */
    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.achievementController.createAchievement,
    );

    /** Fetch a single achievement */
    router.get("/:achievementId", this.achievementController.getOneAchievement);

    /** Delete an achievement (Requires Authentication) */
    router.delete(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.deleteAchievement,
    );

    /** Update an achievement (Requires Authentication) */
    router.patch(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.updateAchievement,
    );

    return router;
  }
}

export const achievementRouterInstance = new AchievementRouter();
