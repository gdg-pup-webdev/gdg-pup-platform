import { ServiceError } from "@/classes/ServerError";
import {
  TransactionService,
  transactionServiceInstance,
} from "@/modules/economySystem/transactions/transaction.service";
import {
  WalletService,
  walletServiceInstance,
} from "@/modules/economySystem/wallets/wallet.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class TransactionController {
  constructor(
    private transactionService: TransactionService = transactionServiceInstance,
  ) {}

  listTransactions: RequestHandler = createExpressController(
    contract.api.economy_system.transactions.GET,
    async ({ input, output, ctx }) => {
      // pagination parameters
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId;
      const walletId = input.query.walletId;

      let list, count;

      if (userId) {
        const { data, error } = await tryCatch(
          async () =>
            await this.transactionService.listTransactionsOfUser(userId),
          "getting user wallet transactions",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      } else if (walletId) {
        const { data, error } = await tryCatch(
          async () =>
            await this.transactionService.listTransactionsOfWallet(walletId),
          "getting wallet transactions",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      } else {
        const { data, error } = await tryCatch(
          async () =>
            await this.transactionService.listTransactionsByPage(
              pageNumber,
              pageSize,
            ),
          "listing transactions",
        );

        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      }

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
