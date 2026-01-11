import { Models } from "@packages/nexus-api-contracts";
import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import { WalletService, walletServiceInstance } from "./wallet.service.js";
import { ServerError } from "../../classes/ServerError.js";

export class TransactionService {
  constructor(
    private walletService: WalletService = walletServiceInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance
  ) {}

  listTransactionsOfUser = async (userId: string) => {
    const { data: userWallet } = await this.walletService.getWalletByUserId(
      userId
    );

    const { data: walletTransactions, error: transactionsError } =
      await this.transactionRepository.listTransactionsByWalletId(
        userWallet.id
      );

    if (transactionsError) {
      throw ServerError.internalError(transactionsError.message);
    }

    return { data: walletTransactions };
  };

  create = async (dto: Models.economySystem.transaction.insertDTO) => {
    const { data, error } =
      await this.transactionRepository.createTransaction(dto);

    if (error) {
      throw ServerError.internalError(error.message || "Failed to create transaction.");
    }

    return { data };
  };
}

export const transactionServiceInstance = new TransactionService();
