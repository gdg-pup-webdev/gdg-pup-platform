import { describe, expect, it, beforeEach } from "vitest";
import { IWalletRepository } from "../domain/IWalletRepository";
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { GetUserWallet } from "../useCases/GetUserWallet";
import { Wallet } from "../domain/Wallet";

let walletRepository: IWalletRepository;
let getUserWalletUseCase: GetUserWallet;

const initializeInstances = () => {
  // Casting to MockWalletRepository to access the __seed helper
  walletRepository = new MockWalletRepository();
  getUserWalletUseCase = new GetUserWallet(walletRepository);
};

describe("GetUserWallet Use Case", () => {
  beforeEach(initializeInstances);

  it("should return the wallet when the user exists", async () => {
    // 1. Arrange: Seed a wallet for a specific user
    const userId = "erwin_123";
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: 1000,
      updatedAt: new Date().toISOString(),
      points: {
        sparkPoints: 600,
        webdevPoints: 400,
      },
    });
    
    // Using the seed helper from our Mock
    (walletRepository as MockWalletRepository).__seed(wallet);

    // 2. Act
    const result = await getUserWalletUseCase.execute(userId);

    // 3. Assert
    expect(result).not.toBeNull();
    expect(result?.props.userId).toBe(userId);
    expect(result?.props.totalPoints).toBe(1000);
    expect(result?.props.points.sparkPoints).toBe(600);
  });

  it("should return null when the wallet/user does not exist", async () => {
    // 1. Act
    const result = await getUserWalletUseCase.execute("unknown_user");

    // 2. Assert
    expect(result).toBeNull();
  });

  it("should maintain domain integrity after retrieval", async () => {
    // 1. Arrange: Seed a wallet
    const userId = "test_user";
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: 50,
      updatedAt: new Date().toISOString(),
      points: {
        sparkPoints: 50,
        webdevPoints: 0,
      },
    });
    (walletRepository as MockWalletRepository).__seed(wallet);

    // 2. Act: Retrieve and perform a domain action
    const retrievedWallet = await getUserWalletUseCase.execute(userId);
    retrievedWallet?.updatePoints("webdevPoints", 50);

    // 3. Assert: Verify the logic within the retrieved object works
    expect(retrievedWallet?.props.totalPoints).toBe(100);
    expect(retrievedWallet?.props.points.webdevPoints).toBe(50);
  });
});