import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest/serverExpress";
import { RequestHandler } from "express";
import {
  TransactionService,
  transactionServiceInstance,
} from "./transaction.service";

/**
 * @deprecated
 */
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService = transactionServiceInstance,
  ) {}

  /**
   * @deprecated
   */
  listTransactions: RequestHandler = createExpressController(
    contract.api.economy_system.transactions.GET,
    async ({ input, output }) => {
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      const userId = input.query.userId;
      const walletId = input.query.walletId;

      const data = await this.transactionService.listTransactions(
        pageNumber,
        pageSize,
        {
          userId,
          walletId,
        },
      );

      const list = data.list;
      const count = data.count;

      return output(200, {
        status: "success",
        message: "User wallet transactions fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / pageSize),
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
        },
      });
    },
  );
}
/**
 * @deprecated
 */
export const transactionControllerInstance = new TransactionController();
