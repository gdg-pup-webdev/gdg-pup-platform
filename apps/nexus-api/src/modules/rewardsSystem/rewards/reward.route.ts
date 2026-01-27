import { Router } from "express";
import {
  rewardControllerInstance,
  RewardController,
} from "./reward.controller.js";
import {
  AuthMiddleware,
  authMiddlewareInstance,
} from "@/middlewares/auth.middleware.js";

export class RewardRouter {
  constructor(
    private readonly controller: RewardController = rewardControllerInstance,
    private readonly authMiddleware: AuthMiddleware = authMiddlewareInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.controller.listRewards);
    router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.controller.createReward,
    );
    router.get("/:rewardId", this.controller.getReward);
    router.post("/:rewardId/claim", this.controller.claimReward);

    return router;
  };
}

export const rewardRouterInstance = new RewardRouter();
