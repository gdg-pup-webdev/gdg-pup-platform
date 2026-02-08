import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "../transactions/transaction.repository.js";
import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";
import { NotFoundError } from "@/errors/HttpError.js"; 

/**
 * Service for managing wallet business logic.
 * Orchestrates wallet updates and transaction creation.
 */
export type WalletListFilters = {
  userId?: string | null;
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
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   * @throws {NotFoundError} If the wallet is not found.
   */
  getWalletByUserId = async (userId: string) => {
    const data = await this.walletRepository.listWalletsOfUser(userId);

    if (!data) throw new NotFoundError("Wallet not found.");

    return data;
  };

  /**
   * Lists all wallets with pagination applied.
   *
   * @returns A promise resolving to a list of wallets.
   */
  listWallets = async (pageNumber: number, pageSize: number) => {
    return await this.listWalletsWithFilters(pageNumber, pageSize, {});
  };

  /**
   * Lists wallets based on provided filters.
   *
   * @param filters - Filter options for listing wallets.
   * @returns A promise resolving to the list of wallets.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   * @throws {NotFoundError} If no wallets are found.
   */
  listWalletsWithFilters = async (
    pageNumber: number,
    pageSize: number,
    filters: WalletListFilters,
  ) => {
    const data = await this.walletRepository.listWalletsWithFilters(
      pageNumber,
      pageSize,
      filters,
    );

    if (!data) throw new NotFoundError("Wallets not found.");

    return data;
  };

  /**
   * Increments points in a user's wallet and records a transaction.
   *
   * @param sourceType - The source of the points (e.g., "event", "reward").
   * @returns A promise resolving to the created transaction and updated wallet.
   * @throws {RepositoryError_DEPRECATED} If any database operation fails.
   * @throws {NotFoundError} If the user's wallet is not found.
   */
  incrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    const wallet = await this.walletRepository.listWalletsOfUser(userId);

    const updatedWallet = await this.walletRepository.updateWalletBalance(
      userId,
      wallet.balance + amount,
    );

    const newTransaction = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: amount,
      source_type: sourceType,
      source_id: sourceId,
    });

    return { transaction: newTransaction, updatedWallet: updatedWallet };
  };

  /**
   * Decrements points from a user's wallet and records a transaction.
   *
   * @param sourceType - The source of the deduction.
   * @returns A promise resolving to the created transaction and updated wallet.
   * @throws {RepositoryError_DEPRECATED} If any database operation fails.
   * @throws {NotFoundError} If the user's wallet is not found.
   */
  decrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string,
  ) => {
    const wallet = await this.walletRepository.listWalletsOfUser(userId);

    const updatedWallet = await this.walletRepository.updateWalletBalance(
      userId,
      wallet.balance - amount,
    );

    const newTransaction = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: -amount,
      source_type: sourceType,
      source_id: sourceId,
    });

    return { transaction: newTransaction, updatedWallet: updatedWallet };
  };
}

export const walletServiceInstance = new WalletService();
