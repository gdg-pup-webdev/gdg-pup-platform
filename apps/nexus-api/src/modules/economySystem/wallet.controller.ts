import { ServiceError } from "@/classes/ServerError";
import {
  TransactionService,
  transactionServiceInstance,
} from "@/modules/economySystem/transaction.service";
import {
  WalletService,
  walletServiceInstance,
} from "@/modules/economySystem/wallet.service";
import { tryCatch } from "@/utils/tryCatch.util";
import { contract } from "@packages/nexus-api-contracts";
import { createExpressController } from "@packages/typed-rest";
import { RequestHandler } from "express";

export class WalletController {
  constructor(
    private walletService: WalletService = walletServiceInstance,
    private transactionService: TransactionService = transactionServiceInstance,
  ) {}

  getWallet: RequestHandler = (req, res) => {
    const walletId = req.params.walletId;

    // get wallet by id service

    return res.status(500).json({ message: "not implemented" });
  };

  listWallets: RequestHandler = createExpressController(
    contract.api.economy_system.wallets.GET,
    async ({ input, output, ctx }) => {
      // PAGINATION OPTIONS
      const pageNumber = input.query.pageNumber;
      const pageSize = input.query.pageSize;

      // getting filters
      const userId = input.query.userId || null;

      let list;
      let count;

      if (userId) {
        const { data, error } = await tryCatch(
          async () => await this.walletService.getWalletByUserId(userId),
          "getting user wallet",
        );
        if (error) throw new ServiceError(error.message);

        list = [data];
        count = 1;
      } else {
        const { data, error } = await tryCatch(
          async () => await this.walletService.listWallets(),
          "listing wallets",
        );
        if (error) throw new ServiceError(error.message);

        list = data.list;
        count = data.count;
      }

      return output(200, {
        status: "success",
        message: "Wallets fetched successfully",
        data: list,
        meta: {
          totalRecords: count,
          totalPages: Math.ceil(count / input.query.pageSize),
          currentPage: input.query.pageNumber,
          pageSize: input.query.pageSize,
        },
      });
    },
  );
}

export const walletControllerInstance = new WalletController();
