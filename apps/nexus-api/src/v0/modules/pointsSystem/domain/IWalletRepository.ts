import { Wallet } from "./Wallet";

export abstract class IWalletRepository {
  constructor() {}

  abstract findByUserId(userId: string): Promise<Wallet | null>;

  abstract persistUpdates(wallet: Wallet): Promise<Wallet>;
}
