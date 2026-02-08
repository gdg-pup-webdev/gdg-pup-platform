import {
  TransactionService,
  transactionServiceInstance,
} from "@/modules/economySystem/transactions/transaction.service";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

/**
 * Controller for handling transaction-related HTTP requests.
 * Implements endpoints defined in the economy system contract.
 */
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService = transactionServiceInstance,
  ) {}

  /**
   * Lists transactions with optional filtering and pagination.
   *
   * @route GET /api/economy-system/transactions
   * @returns JSON response containing the list of transactions and pagination metadata.
   * @throws {ServiceError_DEPRECATED} If the service layer encounters an error.
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

export const transactionControllerInstance = new TransactionController();
