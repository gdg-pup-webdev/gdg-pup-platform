import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet } from "../domain/Wallet";

/**
 * GetUserWallet Use Case
 *
 * Retrieves the wallet for a given user.
 */
export class GetUserWallet {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findByUserId(userId);
  }
}
