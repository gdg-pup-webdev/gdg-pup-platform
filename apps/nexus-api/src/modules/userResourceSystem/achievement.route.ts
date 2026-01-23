import { Router } from "express";
import {
  AchievementController,
  achievementControllerInstance,
} from "./achievement.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware";

export class AchievementRouter {
  constructor(
    private achievementController: AchievementController = achievementControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter() {
    const router: Router = Router();

    router.get("/", this.achievementController.listUserAchievements);

    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.achievementController.createAchievement,
    );

    router.get("/:achievementId", this.achievementController.getOneAchievement);

    router.delete(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.deleteAchievement,
    );

    router.patch(
      "/:achievementId",
      this.authMiddleware.requireAuth(),
      this.achievementController.updateAchievement,
    );

    return router;
  }
}

export const achievementRouterInstance = new AchievementRouter();
