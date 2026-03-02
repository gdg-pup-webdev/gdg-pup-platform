/**
 * @file achievement.route.ts
 * @description Defines the HTTP routes for Achievement management.
 * Integrates with authentication middleware to protect write operations.
 */

import { Router } from "express";
import {
  AchievementsHttpController, 
} from "./achievement.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class AchievementsRouter {
  router: Router;
  constructor(
    private achievementController: AchievementsHttpController  ,
    private authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    /** Publicly list achievements or filter by user */
    this.router.get("/", this.achievementController.listUserAchievements);

    /** Create a new achievement (Requires Authentication) */
    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.achievementController.createAchievement,
    );

    /** Fetch a single achievement */
    this.router.get(
      "/:achievementId",
      this.achievementController.getOneAchievement,
    );

    /** Delete an achievement (Requires Authentication) */
    this.router.delete(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.deleteAchievement,
    );

    /** Update an achievement (Requires Authentication) */
    this.router.patch(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.updateAchievement,
    );
  }
}
