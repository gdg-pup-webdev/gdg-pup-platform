import { Router } from "express";
import { WalletHttpController } from "./wallet.controller";

export class WalletRouter {
  router: Router;

  constructor(private readonly walletHttpController: WalletHttpController) {
    this.router = Router();

    // GET  /wallet/:userId          — fetch wallet state
    this.router.get("/:userId", this.walletHttpController.getWallet);

    // GET  /wallet/:userId/history  — paginated transaction history
    this.router.get(
      "/:userId/history",
      this.walletHttpController.getHistory,
    );

    // POST /wallet/:userId/give-points    — credit points
    this.router.post(
      "/:userId/give-points",
      this.walletHttpController.givePoints,
    );

    // POST /wallet/:userId/consume-points — debit points
    this.router.post(
      "/:userId/consume-points",
      this.walletHttpController.consumePoints,
    );
  }
}
