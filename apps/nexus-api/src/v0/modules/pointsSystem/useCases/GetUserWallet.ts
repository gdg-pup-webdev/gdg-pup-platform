import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet } from "../domain/Wallet";

export class GetUserWallet {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<Wallet | null> {
    const wallet = this.walletRepository.findByUserId(userId);

    return wallet;
  }
}
