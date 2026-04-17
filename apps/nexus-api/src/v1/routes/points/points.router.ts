import { Router } from "express";
import { PointsHttpController } from "./points.controller";
import { requirePermissions } from "@/v1/middlewares/rbac.middleware";
import { requireAuthenticated } from "@/v1/middlewares/auth.middleware";

export class PointsRouter {
  router: Router;

  constructor(private readonly pointsHttpController: PointsHttpController) {
    this.router = Router();
 
    /**
     * PUBLIC ROUTES 
     */
    this.router.get("/:userId", this.pointsHttpController.getWallet);
 
    /**
     * AUTHENTICATED ROUTES 
     */
    this.router.use(requireAuthenticated());
    this.router.get("/:userId/history", this.pointsHttpController.getHistory);
    this.router.get(
      "/transactions/:transactionId",
      this.pointsHttpController.getTransaction,
    );

    /**
     * PRIVATE ROUTES 
     */
    this.router.use(requirePermissions({
      points: ["mutations"],
    }))
    this.router.post("/:userId/give", this.pointsHttpController.givePoints);
    this.router.post("/:userId/consume", this.pointsHttpController.consumePoints);
 
  }
}
