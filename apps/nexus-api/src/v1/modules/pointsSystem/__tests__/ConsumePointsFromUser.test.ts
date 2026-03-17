import { describe, it, expect, beforeEach } from "vitest"; 
import { PointEntry } from "../domain/TransactionRecord";
import { Wallet } from "../domain/Wallet";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { ConsumePointsFromUser } from "../useCases/ConsumePointsFromUser";

describe("ConsumePointsFromUser Use Case", () => {
  let walletRepo: MockWalletRepository;
  let txRepo: MockTransactionRepository;
  let useCase: ConsumePointsFromUser;

  const seedWallet = (
    userId = "user-1",
    points = { sparkPoints: 200, webdevPoints: 100 },
  ) => {
    const wallet = Wallet.hydrate({
      userId,
      points,
      totalPoints: Object.values(points).reduce((s, v) => s + v, 0),
      updatedAt: new Date().toISOString(),
    });
    walletRepo.__seed(wallet);
    return wallet;
  };

  beforeEach(() => {
    walletRepo = new MockWalletRepository();
    txRepo = new MockTransactionRepository();
    useCase = new ConsumePointsFromUser(walletRepo, txRepo);
  });

  it("should debit a single point type and create a transaction", async () => {
    seedWallet();
    const { wallet, transaction } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 50 },
    ]);

    expect(wallet.props.points.sparkPoints).toBe(150);
    expect(wallet.props.totalPoints).toBe(250);
    expect(transaction.props.entries[0].amount).toBe(-50);
  });

  it("should debit multiple point types in one operation", async () => {
    seedWallet();
    const { wallet, transaction } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 100 },
      { pointType: "webdevPoints", amount: 50 },
    ]);

    expect(wallet.props.points.sparkPoints).toBe(100);
    expect(wallet.props.points.webdevPoints).toBe(50);
    expect(wallet.props.totalPoints).toBe(150);
    expect(transaction.props.entries).toHaveLength(2);
    expect(transaction.props.entries.every((e: PointEntry) => e.amount < 0)).toBe(true);
  });

  it("should allow consuming the entire balance (down to zero)", async () => {
    seedWallet("user-2", { sparkPoints: 100, webdevPoints: 0 });
    const { wallet } = await useCase.execute("user-2", [
      { pointType: "sparkPoints", amount: 100 },
    ]);
    expect(wallet.props.points.sparkPoints).toBe(0);
    expect(wallet.props.totalPoints).toBe(0);
  });

  it("should throw when the wallet does not exist", async () => {
    await expect(
      useCase.execute("ghost-user", [{ pointType: "sparkPoints", amount: 10 }]),
    ).rejects.toThrow(/Wallet not found/);
  });

  it("should throw when entries array is empty", async () => {
    seedWallet();
    await expect(useCase.execute("user-1", [])).rejects.toThrow(
      /At least one point entry/,
    );
  });

  it("should throw when entry amount is zero", async () => {
    seedWallet();
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: 0 }]),
    ).rejects.toThrow(/must be positive/);
  });

  it("should throw when entry amount is negative", async () => {
    seedWallet();
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: -10 }]),
    ).rejects.toThrow(/must be positive/);
  });

  it("should throw when balance is insufficient for one of the entries", async () => {
    seedWallet("user-1", { sparkPoints: 50, webdevPoints: 100 });
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: 100 }]),
    ).rejects.toThrow(/Insufficient sparkPoints/);
  });

  it("should not persist wallet changes if an insufficient-balance error occurs", async () => {
    seedWallet("user-1", { sparkPoints: 50, webdevPoints: 0 });
    // Try to consume more sparkPoints than available
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: 200 }]),
    ).rejects.toThrow();

    // Wallet should retain original balance
    const wallet = await walletRepo.findByUserId("user-1");
    expect(wallet?.props.points.sparkPoints).toBe(50);
  });
});
