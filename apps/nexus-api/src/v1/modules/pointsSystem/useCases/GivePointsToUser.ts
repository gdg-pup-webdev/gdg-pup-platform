import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import { IWalletRepository } from "../domain/IWalletRepository.js";
import { PointEntry, TransactionRecordPrototype } from "../domain/TransactionRecord.js";
import { TransactionRecord } from "../domain/TransactionRecord.js";
import { Wallet } from "../domain/Wallet.js";

/**
 * GivePointsToUser Use Case
 *
 * Accepts an array of {pointType, amount} entries (each must be positive),
 * credits them to the user's wallet, and records a single transaction.
 */
export class GivePointsToUser {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    userId: string,
    entries: PointEntry[],
    sourceReference?: string,
    sourceType?: string,
  ): Promise<{ wallet: Wallet; transaction: TransactionRecord }> {
    if (!entries || entries.length === 0) {
      throw new Error("At least one point entry is required.");
    }

    for (const entry of entries) {
      if (entry.amount <= 0) {
        throw new Error(
          `Point amount must be positive for type "${entry.pointType}".`,
        );
      }
    }

    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(`Wallet not found for user "${userId}".`);
    }

    for (const entry of entries) {
      wallet.applyPointsDelta(entry.pointType, entry.amount);
    }

    const updatedWallet = await this.walletRepository.persistUpdates(wallet);

    const prototype = new TransactionRecordPrototype({
      userId,
      entries,
      sourceReference,
      sourceType,
    });
    const transaction =
      await this.transactionRepository.savePrototype(prototype);

    return { wallet: updatedWallet, transaction };
  }
}
