import { ITransactionRepository } from "../domain/ITransactionRepository";
import { IWalletRepository } from "../domain/IWalletRepository";
import { PointEntry, TransactionRecordPrototype } from "../domain/TransactionRecord";
import { TransactionRecord } from "../domain/TransactionRecord";
import { Wallet } from "../domain/Wallet";

/**
 * ConsumePointsFromUser Use Case
 *
 * Accepts an array of {pointType, amount} entries (each must be positive),
 * debits them from the user's wallet, and records a single transaction
 * (stored with negative amounts to indicate consumption).
 */
export class ConsumePointsFromUser {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    userId: string,
    entries: PointEntry[],
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

    // applyPointsDelta with negative delta – it will throw if balance is insufficient
    for (const entry of entries) {
      wallet.applyPointsDelta(entry.pointType, -entry.amount);
    }

    const updatedWallet = await this.walletRepository.persistUpdates(wallet);

    // Store negative amounts so history shows consumption clearly
    const negativeEntries: PointEntry[] = entries.map((e) => ({
      pointType: e.pointType,
      amount: -e.amount,
    }));

    const prototype = new TransactionRecordPrototype({
      userId,
      entries: negativeEntries,
    });
    const transaction =
      await this.transactionRepository.savePrototype(prototype);

    return { wallet: updatedWallet, transaction };
  }
}
