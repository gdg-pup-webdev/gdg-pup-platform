import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet } from "../domain/Wallet";

export class MockWalletRepository extends IWalletRepository {
  private wallets: Wallet[] = [];

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = this.wallets.find((w) => w.props.userId === userId);
    return wallet || null;
  }

  async persistUpdates(wallet: Wallet): Promise<Wallet> {
    const index = this.wallets.findIndex(
      (w) => w.props.userId === wallet.props.userId,
    );

    if (index !== -1) {
      this.wallets[index] = wallet;
    } else {
      this.wallets.push(wallet);
    }

    return wallet;
  }

  // Helper for testing: seed the mock with data
  __seed(wallet: Wallet) {
    this.wallets.push(wallet);
  }
}
