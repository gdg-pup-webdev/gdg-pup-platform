import { Router } from "express";
import { TransactionsHttpController } from "./transaction.controller";

export class TransactionRouter {
  router: Router;
  constructor(
    private readonly transactionController: TransactionsHttpController,
  ) {
    this.router = Router();

    this.router.get("/", this.transactionController.listTransactions);
  }
}
