import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import { WalletService, walletServiceInstance } from "../wallets/wallet.service.js";
import {
  DatabaseError,
  NotFoundError,
  RepositoryError,
  ServerError,
} from "../../../classes/ServerError.js";
import { PostgrestError } from "@supabase/supabase-js";
import { tryCatch, tryCatchHandled } from "@/utils/tryCatch.util.js";
import { models } from "@packages/nexus-api-contracts";

export class TransactionService {
  constructor(
    private walletService: WalletService = walletServiceInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance,
  ) {}

  listTransactionsOfUser = async (userId: string) => {
    const { data: userWallet, error: walletError } = await tryCatch(
      async () => await this.walletService.getWalletByUserId(userId),
      "fetching wallet of user",
    );

    if (walletError) throw new DatabaseError(walletError.message);
    if (!userWallet) throw new NotFoundError("Wallet not found.");

    const { data: walletTransactions, error: transactionsError } =
      await tryCatch(
        async () =>
          await this.transactionRepository.listTransactionsByWalletId(
            userWallet.id,
          ),
        "listing transactions of user",
      );
    if (transactionsError) throw new RepositoryError(transactionsError.message);
    if (!walletTransactions) throw new NotFoundError("Transactions not found.");

    return walletTransactions;
  };

  listTransactionsOfWallet = async (walletId: string) => {
    const { data: walletTransactions, error: transactionsError } =
      await tryCatch(
        async () =>
          await this.transactionRepository.listTransactionsByWalletId(walletId),
        "listing transactions of wallet",
      );
    if (transactionsError) throw new RepositoryError(transactionsError.message);
    if (!walletTransactions) throw new NotFoundError("Transactions not found.");

    return walletTransactions;
  };

  listTransactionsByPage = async (pageNumber: number, pageSize: number) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.transactionRepository.listTransactions(pageNumber, pageSize),
      "listing transactions",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transactions not found.");

    return data;
  };

  getTransaction = async (id: string) => {
    const { data, error } = await tryCatch(
      async () => await this.transactionRepository.getTransactionById(id),
      "fetching transaction",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };

  create = async (dto: models.economySystem.transaction.insertDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.transactionRepository.createTransaction(dto),
      "creating transaction",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new NotFoundError("Transaction not found.");

    return data;
  };
}

export const transactionServiceInstance = new TransactionService();
