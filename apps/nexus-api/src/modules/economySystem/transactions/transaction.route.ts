import { Router } from "express";
import {
  TransactionController,
  transactionControllerInstance,
} from "./transaction.controller";

export class TransactionRouter {
  constructor(
    private transactionController: TransactionController = transactionControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.transactionController.listTransactions);

    return router;
  };
}

export const transactionRouterInstance = new TransactionRouter();
