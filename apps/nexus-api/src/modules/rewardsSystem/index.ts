import { Router } from "express";
import { RewardRouter, rewardRouterInstance } from "./rewards/reward.route.js";

export class RewardSystemRouter {
  constructor(private readonly rewardRouter: RewardRouter = rewardRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();
    router.use("/rewards", this.rewardRouter.getRouter());
    return router;
  };
}

export const rewardSystemRouterInstance = new RewardSystemRouter();
