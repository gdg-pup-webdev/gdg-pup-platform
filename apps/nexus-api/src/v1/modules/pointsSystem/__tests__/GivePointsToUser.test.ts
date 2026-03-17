import { describe, it, expect, beforeEach } from "vitest"; 
import { Wallet } from "../domain/Wallet";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { GivePointsToUser } from "../useCases/GivePointsToUser";

describe("GivePointsToUser Use Case", () => {
  let walletRepo: MockWalletRepository;
  let txRepo: MockTransactionRepository;
  let useCase: GivePointsToUser;

  const seedWallet = (userId = "user-1", points = { sparkPoints: 0, webdevPoints: 0 }) => {
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
    useCase = new GivePointsToUser(walletRepo, txRepo);
  });

  it("should credit a single point type and create a transaction", async () => {
    seedWallet();
    const { wallet, transaction } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 100 },
    ]);

    expect(wallet.props.points.sparkPoints).toBe(100);
    expect(wallet.props.totalPoints).toBe(100);
    expect(transaction.props.entries).toHaveLength(1);
    expect(transaction.props.entries[0].pointType).toBe("sparkPoints");
    expect(transaction.props.entries[0].amount).toBe(100);
  });

  it("should credit multiple point types in one operation", async () => {
    seedWallet();
    const { wallet, transaction } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 50 },
      { pointType: "webdevPoints", amount: 30 },
    ]);

    expect(wallet.props.points.sparkPoints).toBe(50);
    expect(wallet.props.points.webdevPoints).toBe(30);
    expect(wallet.props.totalPoints).toBe(80);
    expect(transaction.props.entries).toHaveLength(2);
  });

  it("should credit a brand-new point type (not previously in the wallet)", async () => {
    seedWallet();
    const { wallet } = await useCase.execute("user-1", [
      { pointType: "uiuxPoints", amount: 25 },
    ]);
    expect(wallet.props.points.uiuxPoints).toBe(25);
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

  it("should throw when any entry amount is zero", async () => {
    seedWallet();
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: 0 }]),
    ).rejects.toThrow(/must be positive/);
  });

  it("should throw when any entry amount is negative", async () => {
    seedWallet();
    await expect(
      useCase.execute("user-1", [{ pointType: "sparkPoints", amount: -5 }]),
    ).rejects.toThrow(/must be positive/);
  });

  it("should assign a unique transaction id", async () => {
    seedWallet();
    const { transaction: t1 } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 10 },
    ]);
    const { transaction: t2 } = await useCase.execute("user-1", [
      { pointType: "sparkPoints", amount: 20 },
    ]);
    expect(t1.props.id).not.toBe(t2.props.id);
  });
});
