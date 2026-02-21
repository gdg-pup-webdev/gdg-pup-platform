import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet } from "../domain/Wallet";

export class TakePointsFromUser {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(
    userId: string,
    pointsType: string,
    amount: number,
  ): Promise<Wallet | null> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    // DONT FORGET THE NEGATIVE SIGN!
    wallet.updatePoints(pointsType, -amount);

    const updatedWallet = await this.walletRepository.persistUpdates(wallet);

    return updatedWallet;
  }
}
