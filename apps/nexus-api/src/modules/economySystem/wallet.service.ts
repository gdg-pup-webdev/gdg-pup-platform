import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository = walletRepositoryInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance
  ) {}

  getWalletByUserId = async (userId: string) => {
    const { data, error } =
      await this.walletRepository.getWalletByUserId(userId);
    if (error) {
      return { error };
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
    if (walletFetchError || !wallet) {
      return { error: walletFetchError || new Error("Wallet not found.") };
    }

    // calculate new balance
    const newBalance = wallet.balance + amount;

    // create new transaction to increment points
    const { data, error } = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: amount,
      source_type: sourceType,
      source_id: sourceId,
    });
    if (error || !data) {
      return { error: error || new Error("Failed to create transaction.") };
    }

    // update wallet balance
    const { error: updateError } =
      await this.walletRepository.updateWalletBalance(userId, newBalance);
    if (updateError) {
      return { error: updateError };
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
    if (walletFetchError || !wallet) {
      return { error: walletFetchError || new Error("Wallet not found.") };
    }

    // create new transaction to decrement points by 1
    const { data, error } = await this.transactionRepository.createTransaction({
      wallet_id: wallet.id,
      amount: -amount,
      source_type: sourceType,
      source_id: sourceId,
    });
    if (error || !data) {
      return { error: error || new Error("Failed to create transaction.") };
    }

    // calculate new balance
    const newBalance = wallet.balance - amount;

    // update wallet balance
    const { error: updateError } =
      await this.walletRepository.updateWalletBalance(userId, newBalance);
    if (updateError) {
      return { error: updateError };
    }

    // build response

    return { data: { transaction: data, newBalance } };
  };
}

export const walletServiceInstance = new WalletService();
