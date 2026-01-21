import { Router } from "express";
import { RewardRouter, rewardRouterInstance } from "./reward.route";

export class RewardSystemRouter {
  constructor(private rewardRouter: RewardRouter = rewardRouterInstance) {}

  getRouter = (): Router => {
    const router = Router();
    router.use("/rewards", this.rewardRouter.getRouter());
    return router;
  };
}

export const rewardSystemRouterInstance = new RewardSystemRouter();
