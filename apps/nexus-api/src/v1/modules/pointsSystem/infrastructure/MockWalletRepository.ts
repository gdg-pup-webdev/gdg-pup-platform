import { IWalletRepository } from "../domain/IWalletRepository";
import { Wallet, WalletProps } from "../domain/Wallet";

/**
 * MockWalletRepository
 *
 * In-memory implementation used during testing.
 */
export class MockWalletRepository extends IWalletRepository {
  private wallets: Map<string, Wallet> = new Map();

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.wallets.get(userId) ?? null;
  }

  async persistUpdates(wallet: Wallet): Promise<Wallet> {
    this.wallets.set(wallet.props.userId, wallet);
    return wallet;
  }

  /** Seed helper for tests */
  __seed(wallet: Wallet): void {
    this.wallets.set(wallet.props.userId, wallet);
  }

  /** Build and seed a wallet in one call */
  __seedFromProps(props: WalletProps): Wallet {
    const wallet = Wallet.hydrate(props);
    this.__seed(wallet);
    return wallet;
  }
}