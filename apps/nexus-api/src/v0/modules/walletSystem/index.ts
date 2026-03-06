<<<<<<< HEAD:apps/nexus-api/src/deprecated/index.ts
import { Router } from "express";
import {
  TransactionRouter,
  transactionRouterInstance,
} from "./walletSystem/transactions/transaction.route";
import {
  WalletRouter,
  walletRouterInstance,
} from "./walletSystem/wallets/wallet.route";
=======
import { Router } from "express"; 
import { TransactionRouter, transactionRouterInstance } from "./transactions/transaction.route";
import { WalletRouter, walletRouterInstance } from "./wallets/wallet.route";
>>>>>>> dev:apps/nexus-api/src/v0/modules/walletSystem/index.ts
/**
 * @deprecated
 */
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
/**
 * @deprecated
 */
export const economySystemRouterInstance = new EconomySystemRouter();
