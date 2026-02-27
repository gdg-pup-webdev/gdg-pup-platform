import { describe, expect, it, beforeEach } from "vitest";
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { GivePointsToUser } from "../useCases/GivePointsToUser";
import { Wallet } from "../domain/Wallet";

let walletRepository: MockWalletRepository;
let transactionRepository: MockTransactionRepository;
let givePointsToUserUseCase: GivePointsToUser;

const initializeInstances = () => {
  walletRepository = new MockWalletRepository();
  transactionRepository = new MockTransactionRepository();
  givePointsToUserUseCase = new GivePointsToUser(walletRepository, transactionRepository);
};

describe("GivePointsToUser Use Case", () => {
  beforeEach(initializeInstances);

  it("should successfully update wallet and create a transaction record", async () => {
    // 1. Arrange
    const userId = "user_789";
    const initialPoints = 100;
    const pointsToAdd = 50;
    
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: initialPoints,
      updatedAt: new Date().toISOString(),
      points: { sparkPoints: initialPoints, webdevPoints: 0 },
    });
    walletRepository.__seed(wallet);

    // 2. Act
    const result = await givePointsToUserUseCase.execute(
      userId,
      "sparkPoints",
      pointsToAdd,
      "ref_001",
      "STUDY_JAM_BONUS"
    );

    // 3. Assert - Wallet State
    expect(result.updatedWallet.props.totalPoints).toBe(initialPoints + pointsToAdd);
    expect(result.updatedWallet.props.points.sparkPoints).toBe(initialPoints + pointsToAdd);

    // 3. Assert - Transaction Record
    expect(result.transactionRecord.props.userId).toBe(userId);
    expect(result.transactionRecord.props.pointsChange).toBe(pointsToAdd);
    expect(result.transactionRecord.props.sourceType).toBe("STUDY_JAM_BONUS");
    
    // Ensure persistence was actually called
    const savedWallet = await walletRepository.findByUserId(userId);
    expect(savedWallet?.props.totalPoints).toBe(150);
  });

  it("should throw an error if the user wallet does not exist", async () => {
    // 1. Act & Assert
    await expect(
      givePointsToUserUseCase.execute(
        "non_existent_user",
        "sparkPoints",
        10,
        "ref_999",
        "TEST"
      )
    ).rejects.toThrow("Wallet not found");
  });

  it("should throw an error for an invalid points type", async () => {
    // 1. Arrange
    const userId = "user_webdev";
    const wallet = Wallet.hydrate({
      userId,
      totalPoints: 0,
      updatedAt: new Date().toISOString(),
      points: { sparkPoints: 0, webdevPoints: 0 },
    });
    walletRepository.__seed(wallet);

    // 2. Act & Assert
    // Using an invalid points type should trigger the error inside the Wallet domain entity
    await expect(
      givePointsToUserUseCase.execute(
        userId,
        "invalidPointsType",
        50,
        "ref_123",
        "TEST"
      )
    ).rejects.toThrow("Invalid points type");
  });
});