import { Router } from "express";
import { RewardsHttpController } from "./reward.controller.js";
import { AuthMiddleware } from "@/presentation/middlewares/auth.middleware.js";

export class RewardsRouter {
  router: Router;

  constructor(
    private readonly controller: RewardsHttpController,
    private readonly authMiddleware: AuthMiddleware,
  ) {
    this.router = Router();

    this.router.get("/", this.controller.listRewards);
    this.router.post(
      "/",
      this.authMiddleware.requireAuth(),
      this.controller.createReward,
    );
    this.router.get("/:rewardId", this.controller.getReward);
    this.router.post("/:rewardId/claim", this.controller.claimReward);
  }
}
