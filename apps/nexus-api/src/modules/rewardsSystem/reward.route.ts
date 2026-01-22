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
    private controller: RewardController = rewardControllerInstance,
    private authMiddleware: AuthMiddleware = authMiddlewareInstance,
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
    router.post("/:rewardId/redeem", this.controller.claimReward);

    return router;
  };
}

export const rewardRouterInstance = new RewardRouter();
