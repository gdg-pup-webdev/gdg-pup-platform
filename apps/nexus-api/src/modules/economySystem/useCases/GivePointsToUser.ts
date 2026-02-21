import { IWalletRepository } from "../domain/IWalletRepository";
import { TransactionRecordPrototype } from "../domain/TransactionRecord";
import { Wallet } from "../domain/Wallet";

export class GivePointsToUser {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(
    userId: string,
    pointsType: string,
    points: number,
    sourceReference: string
  ): Promise<Wallet | null> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.updatePoints(pointsType, points);

    // create new transaction 
    const transactionPrototype = new TransactionRecordPrototype({
        amount: points, 
        sourceReference: 
    })

    const updatedWallet = await this.walletRepository.persistUpdates(wallet);

    return updatedWallet;
  }
}
