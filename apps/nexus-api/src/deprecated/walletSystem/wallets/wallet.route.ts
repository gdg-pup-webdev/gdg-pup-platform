import { Router } from "express";
import {
  WalletController,
  walletControllerInstance,
} from "./wallet.controller";
/**
 * @deprecated 
 */
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
/**
 * @deprecated 
 */
export const walletRouterInstance = new WalletRouter();
