import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";
import {
  CantCreateError,
  DatabaseError,
  NotFoundError,
  RepositoryError,
  ServerError,
} from "../../classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository = walletRepositoryInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance,
  ) {}

  getWalletByUserId = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.walletRepository.getWalletByUserId(userId),
      "calling repository to fetch wallet using user id",
    );

    if (error) throw new RepositoryError(error.message);

    if (!data) throw new NotFoundError("Wallet not found.");

    return data;
  };

  incrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    /**
     * MAIN BUSINESS LOGIC
     */
    // get wallet of the user
    const { data: wallet, error: walletFetchError } = await tryCatch(
      async () => await this.walletRepository.getWalletByUserId(userId),
      "calling repository to fetch wallet using user id",
    );
    if (walletFetchError) throw new RepositoryError(walletFetchError.message);
    if (!wallet) throw new NotFoundError("Wallet not found.");

    // calculate new balance
    const newBalance = wallet.balance + amount;
    // update wallet balance
    const { error: updateWalletError } = await tryCatch(
      async () =>
        await this.walletRepository.updateWalletBalance(userId, newBalance),
      "calling repository to update wallet balance",
    );
    if (updateWalletError) throw new RepositoryError(updateWalletError.message);

    /**
     * SIDE EFFECTS
     */
    // create new transaction to increment points
    const { data, error } = await tryCatch(
      async () =>
        await this.transactionRepository.createTransaction({
          wallet_id: wallet.id,
          amount: amount,
          source_type: sourceType,
          source_id: sourceId,
        }),
      "calling repository to create transaction record",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data)
      throw new RepositoryError("Failed to create transaction record.");

    // build response
    return {transaction: data, updatedWallet: wallet};
  };

  decrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    /**
     * MAIN BUSINESS LOGIC
     */
    // get wallet of the user
    const { data: wallet, error: walletFetchError } = await tryCatch(
      async () => await this.walletRepository.getWalletByUserId(userId),
      "calling repository to fetch wallet using user id",
    );
    if (walletFetchError) throw new RepositoryError(walletFetchError.message);
    if (!wallet) throw new NotFoundError("Wallet not found.");

    // calculate new balance
    const newBalance = wallet.balance - amount;
    // update wallet balance
    const { error: updateWalletError } = await tryCatch(
      async () =>
        await this.walletRepository.updateWalletBalance(userId, newBalance),
      "calling repository to update wallet balance",
    );
    if (updateWalletError) throw new RepositoryError(updateWalletError.message);

    /**
     * SIDE EFFECTS
     */
    // create new transaction to increment points
    const { data, error } = await tryCatch(
      async () =>
        await this.transactionRepository.createTransaction({
          wallet_id: wallet.id,
          amount: -amount,
          source_type: sourceType,
          source_id: sourceId,
        }),
      "calling repository to create transaction record",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data)
      throw new RepositoryError("Failed to create transaction record.");

    // build response
    return { transaction: data,  updatedWallet: wallet };
  };
}

export const walletServiceInstance = new WalletService();
