import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "../transactions/transaction.repository.js";
import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";
import {
  NotFoundError,
  RepositoryError,
} from "../../../classes/ServerError.js";
import { tryCatch } from "@/utils/tryCatch.util.js";

/**
 * Service for managing wallet business logic.
 * Orchestrates wallet updates and transaction creation.
 */
export type WalletListFilters = {
  userId?: string | null;
  pageNumber: number;
  pageSize: number;
};

export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository = walletRepositoryInstance,
    private readonly transactionRepository: TransactionRepository = transactionRepositoryInstance,
  ) {}

  /**
   * Retrieves a wallet by user ID.
   *
   * @returns A promise resolving to the wallet data.
   * @throws {RepositoryError} If the repository operation fails.
   * @throws {NotFoundError} If the wallet is not found.
   */
  getWalletByUserId = async (userId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.walletRepository.listWalletsOfUser(userId),
      "calling repository to fetch wallet using user id",
    );

    if (error) throw new RepositoryError(error.message);

    if (!data) throw new NotFoundError("Wallet not found.");

    return data;
  };

  /**
   * Lists all wallets with pagination applied.
   *
   * @returns A promise resolving to a list of wallets.
   */
  listWallets = async (pageNumber: number, pageSize: number) => {
    return await this.listWalletsWithFilters({ pageNumber, pageSize });
  };

  /**
   * Lists wallets based on provided filters.
   *
   * @param filters - Filter and pagination options for listing wallets.
   * @returns A promise resolving to the list of wallets.
   * @throws {RepositoryError} If the repository operation fails.
   * @throws {NotFoundError} If no wallets are found.
   */
  listWalletsWithFilters = async (filters: WalletListFilters) => {
    const { data, error } = await tryCatch(
      async () => await this.walletRepository.listWalletsWithFilters(filters),
      "calling repository to list wallets with filters",
    );

    if (error) throw new RepositoryError(error.message);

    if (!data) throw new NotFoundError("Wallets not found.");

    return data;
  };

  /**
   * Increments points in a user's wallet and records a transaction.
   *
   * @param sourceType - The source of the points (e.g., "event", "reward").
   * @returns A promise resolving to the created transaction and updated wallet.
   * @throws {RepositoryError} If any database operation fails.
   * @throws {NotFoundError} If the user's wallet is not found.
   */
  incrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    const { data: wallet, error: walletFetchError } = await tryCatch(
      async () => await this.walletRepository.listWalletsOfUser(userId),
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
    return { transaction: data, updatedWallet: wallet };
  };

  /**
   * Decrements points from a user's wallet and records a transaction.
   *
   * @param sourceType - The source of the deduction.
   * @returns A promise resolving to the created transaction and updated wallet.
   * @throws {RepositoryError} If any database operation fails.
   * @throws {NotFoundError} If the user's wallet is not found.
   */
  decrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    const { data: wallet, error: walletFetchError } = await tryCatch(
      async () => await this.walletRepository.listWalletsOfUser(userId),
      "calling repository to fetch wallet using user id",
    );
    if (walletFetchError) throw new RepositoryError(walletFetchError.message);
    if (!wallet) throw new NotFoundError("Wallet not found.");

    const newBalance = wallet.balance - amount;
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
    return { transaction: data, updatedWallet: wallet };
  };
}

export const walletServiceInstance = new WalletService();
