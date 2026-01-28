import { Router } from "express";
import {
  WalletController,
  walletControllerInstance,
} from "./wallet.controller";

export class WalletRouter {
  constructor(
    private walletController: WalletController = walletControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.walletController.listWallets);

    return router;
  };
}

export const walletRouterInstance = new WalletRouter();
