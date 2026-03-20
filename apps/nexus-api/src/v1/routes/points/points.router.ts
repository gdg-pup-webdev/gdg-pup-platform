import { Router } from "express";
import { PointsHttpController } from "./points.controller";

export class PointsRouter {
  router: Router;

  constructor(private readonly pointsHttpController: PointsHttpController) {
    this.router = Router();

    // GET /points/:userId
    this.router.get("/:userId", this.pointsHttpController.getWallet);

    // GET /points/:userId/history
    this.router.get("/:userId/history", this.pointsHttpController.getHistory);

    // POST /points/:userId/give
    this.router.post("/:userId/give", this.pointsHttpController.givePoints);

    // POST /points/:userId/consume
    this.router.post("/:userId/consume", this.pointsHttpController.consumePoints);

    // GET /points/transactions/:transactionId
    this.router.get(
      "/transactions/:transactionId",
      this.pointsHttpController.getTransaction,
    );
  }
}
