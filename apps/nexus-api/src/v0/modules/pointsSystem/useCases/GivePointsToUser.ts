import { ITransactionRepository } from "../domain/ITransactionRepository";
import { IWalletRepository } from "../domain/IWalletRepository";
import { TransactionRecordPrototype } from "../domain/TransactionRecord"; 

export class GivePointsToUser {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(
    userId: string,
    pointsType: string,
    points: number,
    sourceReference: string,
    sourceType: string,
  ) {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.updatePoints(pointsType, points);

    // create new transaction
    const transactionPrototype = new TransactionRecordPrototype({
      pointsChange: points,
      pointsType,
      sourceReference,
      sourceType,
      userId,
    });

    const updatedWallet = await this.walletRepository.persistUpdates(wallet);
    const newTransaction =
      await this.transactionRepository.savePrototype(transactionPrototype);

    return {
      updatedWallet: updatedWallet,
      transactionRecord: newTransaction,
    };
  }
}
