import { ITransactionRepository } from "../domain/ITransactionRepository.js";
import { IWalletRepository } from "../domain/IWalletRepository.js";
import { TransactionRecordPrototype } from "../domain/TransactionRecord.js";

export class TakePointsFromUser {
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

    const changeInPoints = -points;

    wallet.applyPointsDelta(pointsType, changeInPoints);

    // create new transaction
    const transactionPrototype = new TransactionRecordPrototype({
      userId,
      entries: [
        {
          pointType: pointsType,
          amount: changeInPoints,
        },
      ],
      sourceReference,
      sourceType,
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
