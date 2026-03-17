import { Wallet } from "./Wallet";

/**
 * IWalletRepository
 *
 * Contract for persisting and retrieving Wallet domain objects.
 */
export abstract class IWalletRepository {
  abstract findByUserId(userId: string): Promise<Wallet | null>;
  abstract persistUpdates(wallet: Wallet): Promise<Wallet>;
}