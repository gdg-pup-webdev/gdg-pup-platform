import { Router } from "express";
import {
  TransactionController,
  transactionControllerInstance,
} from "./transaction.controller";
/**
 * @deprecated
 */
export class TransactionRouter {
  constructor(
    private readonly transactionController: TransactionController = transactionControllerInstance,
  ) {}

  getRouter = (): Router => {
    const router = Router();

    router.get("/", this.transactionController.listTransactions);

    return router;
  };
}
/**
 * @deprecated
 */
export const transactionRouterInstance = new TransactionRouter();
