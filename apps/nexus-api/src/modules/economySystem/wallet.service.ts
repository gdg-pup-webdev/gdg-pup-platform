import {
  WalletRepository,
  walletRepositoryInstance,
} from "./wallet.repository.js";

export class WalletService {
  constructor(
    private walletRepository: WalletRepository = walletRepositoryInstance
  ) {}

  getWalletByUserId = async (userId: string) => {
    const { data, error } =
      await this.walletRepository.getWalletByUserId(userId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const walletServiceInstance = new WalletService();