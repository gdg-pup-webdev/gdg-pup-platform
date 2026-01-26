import { Router } from "express";
import {
  TransactionRouter,
  transactionRouterInstance,
} from "./transaction.route";
import { WalletRouter, walletRouterInstance } from "./wallet.route";

export class EconomySystemRouter {
  constructor(
    private transactionRouter: TransactionRouter = transactionRouterInstance,
    private walletRouter: WalletRouter = walletRouterInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.use("/transactions", this.transactionRouter.getRouter());

    router.use("/wallets", this.walletRouter.getRouter());

    return router;
  };
}

export const economySystemRouterInstance = new EconomySystemRouter();
