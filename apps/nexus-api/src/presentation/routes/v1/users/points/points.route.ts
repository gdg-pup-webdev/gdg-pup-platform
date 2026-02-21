import { Router } from "express";
import { PointsHttpController } from "./points.controller";
import { TransactionRouter } from "./transactions/transaction.route";

export class PointsRouter {
  router: Router;
  constructor(
    private walletController: PointsHttpController,
    private transactionsRouter: TransactionRouter,
  ) {
    this.router = Router();

    this.router.get("/", this.walletController.listWallets);
    this.router.use("/transactions", this.transactionsRouter.router);
  }
}
