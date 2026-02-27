import { describe, expect, it, beforeEach } from "vitest";
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { TakePointsFromUser } from "../useCases/TakePointsFromUser";
import { Wallet } from "../domain/Wallet";

let walletRepository: MockWalletRepository;
let transactionRepository: MockTransactionRepository;
let takePointsFromUserUseCase: TakePointsFromUser;

const initializeInstances = () => {
  walletRepository = new MockWalletRepository();
  transactionRepository = new MockTransactionRepository();
  takePointsFromUserUseCase = new TakePointsFromUser(walletRepository, transactionRepository);
};

describe("TakePointsFromUser Use Case", () => {
  beforeEach(initializeInstances);

  it("should successfully deduct points and record a negative transaction", async () => {
    // 1. Arrange: Seed a wallet with enough points
    const userId = "user_redemption";
    const initialPoints = 500;
    const pointsToTake = 200;
    
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: initialPoints,
      updatedAt: new Date().toISOString(),
      points: { sparkPoints: 300, webdevPoints: 200 },
    });
    walletRepository.__seed(wallet);

    // 2. Act
    const result = await takePointsFromUserUseCase.execute(
      userId,
      "webdevPoints",
      pointsToTake,
      "order_001",
      "MERCH_PURCHASE"
    );

    // 3. Assert - Wallet state
    expect(result.updatedWallet.props.points.webdevPoints).toBe(0);
    expect(result.updatedWallet.props.totalPoints).toBe(300);

    // 3. Assert - Transaction record
    expect(result.transactionRecord.props.pointsChange).toBe(-200);
    expect(result.transactionRecord.props.sourceType).toBe("MERCH_PURCHASE");

    // Verify persistence
    const savedWallet = await walletRepository.findByUserId(userId);
    expect(savedWallet?.props.totalPoints).toBe(300);
  });

  it("should throw an error if the wallet is not found", async () => {
    // 1. Act & Assert
    await expect(
      takePointsFromUserUseCase.execute(
        "ghost_user",
        "sparkPoints",
        10,
        "ref_null",
        "TEST"
      )
    ).rejects.toThrow("Wallet not found");
  });

  it("should allow a negative balance if the domain logic permits (optional check)", async () => {
    // 1. Arrange: User has 0 points
    const userId = "user_broke";
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: 0,
      updatedAt: new Date().toISOString(),
      points: { sparkPoints: 0, webdevPoints: 0 },
    });
    walletRepository.__seed(wallet);

    // 2. Act
    const result = await takePointsFromUserUseCase.execute(
      userId,
      "sparkPoints",
      50,
      "penalty_001",
      "MISCONDUCT_PENALTY"
    );

    // 3. Assert
    expect(result.updatedWallet.props.totalPoints).toBe(-50);
    expect(result.transactionRecord.props.pointsChange).toBe(-50);
  });
});