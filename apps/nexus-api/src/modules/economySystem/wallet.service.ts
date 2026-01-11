import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";
import { ServerError } from "../../classes/ServerError.js";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository = walletRepositoryInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance
  ) {}

  getWalletByUserId = async (userId: string) => {
    const { data, error } =
      await this.walletRepository.getWalletByUserId(userId);
    if (error) {
      throw ServerError.internalError(error.message);
    }
    return { data };
  };

  incrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string
  ) => {
    // get wallet of the user
    const { data: wallet, error: walletFetchError } =
      await this.walletRepository.getWalletByUserId(userId);
    if (walletFetchError) {
      throw ServerError.internalError(walletFetchError.message);
    }
    if (!wallet) {
      throw ServerError.notFound("Wallet not found.");
    }

    /**
     * SIDE EFFECTS
     */
    // create new transaction to increment points
    const { data, error } = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: amount,
      source_type: sourceType,
      source_id: sourceId,
    });
    if (error) {
      throw ServerError.internalError(error.message);
    }
    if (!data) {
      throw ServerError.internalError("Failed to create transaction record.");
    }

    /**
     * MAIN BUSINESS LOGIC
     */
    // calculate new balance
    const newBalance = wallet.balance + amount;
    // update wallet balance
    const { error: updateError } =
      await this.walletRepository.updateWalletBalance(userId, newBalance);
    if (updateError) {
      throw ServerError.internalError(updateError.message);
    }

    // build response

    return { data: { transaction: data, newBalance } };
  };

  decrementPoints = async (
    userId: string,
    amount: number,
    sourceType: string,
    sourceId: string
  ) => {
    // get wallet of the user
    const { data: wallet, error: walletFetchError } =
      await this.walletRepository.getWalletByUserId(userId);
    if (walletFetchError) {
      throw ServerError.internalError(walletFetchError.message);
    }
    if (!wallet) {
      throw ServerError.notFound("Wallet not found.");
    }

    /**
     * SIDE EFFECTS
     */
    // create new transaction to decrement points by 1
    const { data, error } = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: -amount,
      source_type: sourceType,
      source_id: sourceId,
    });
    if (error) {
      throw ServerError.internalError(error.message);
    }
    if (!data) {
      throw ServerError.internalError("Failed to create transaction record.");
    }

    /**
     * MAIN BUSINESS LOGIC
     */
    // calculate new balance
    const newBalance = wallet.balance - amount;
    // update wallet balance
    const { error: updateError } =
      await this.walletRepository.updateWalletBalance(userId, newBalance);
    if (updateError) {
      throw ServerError.internalError(updateError.message);
    }

    // build response

    return { data: { transaction: data, newBalance } };
  };
}

export const walletServiceInstance = new WalletService();
