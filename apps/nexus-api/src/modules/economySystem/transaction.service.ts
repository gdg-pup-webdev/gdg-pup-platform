import { Models } from "@packages/nexus-api-contracts";
import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import { WalletService, walletServiceInstance } from "./wallet.service.js";

export class TransactionService {
  constructor(
    private walletService: WalletService = walletServiceInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance
  ) {}

  listTransactionsOfUser = async (userId: string) => {
    const { data: userWallet, error: walletError } =
      await this.walletService.getWalletByUserId(userId);

    if (walletError) {
      return { error: walletError };
    }

    const { data: walletTransactions, error: transactionsError } =
      await this.transactionRepository.listTransactionsByWalletId(
        userWallet.id
      );

    if (transactionsError) {
      return { error: transactionsError };
    }

    return { data: walletTransactions };
  };

  create = async (dto: Models.economySystem.transaction.insertDTO) => {
    const { data, error } =
      await this.transactionRepository.createTransaction(dto);

    if (error) {
      return { error: error || new Error("Failed to create transaction.") };
    }

    return { data };
  };
}

export const transactionServiceInstance = new TransactionService();
