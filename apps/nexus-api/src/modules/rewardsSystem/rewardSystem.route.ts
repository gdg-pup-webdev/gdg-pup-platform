import { Router } from "express";
import {
  rewardSystemControllerInstance,
  RewardSystemController,
} from "./rewardSystem.controller.js";

export class RewardSystemRouter {
  constructor(
    private controller: RewardSystemController = rewardSystemControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.post("rewards/", this.controller.createReward);
    router.get("rewards/", this.controller.listRewards);
    router.get("rewards/:rewardId", this.controller.getReward);

    router.put("rewards/redeem", this.controller.claimReward);

    return router;
  };
}

export const rewardSystemRouter = new RewardSystemRouter();
