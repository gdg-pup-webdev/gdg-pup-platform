import { describe, it, expect, beforeEach } from "vitest"; 
import { MockWalletRepository } from "../infrastructure/MockWalletRepository";
import { GetUserWallet } from "../useCases/GetUserWallet";

describe("GetUserWallet Use Case", () => {
  let walletRepo: MockWalletRepository;
  let useCase: GetUserWallet;

  beforeEach(() => {
    walletRepo = new MockWalletRepository();
    useCase = new GetUserWallet(walletRepo);
  });

  it("should return the wallet for a user who has one", async () => {
    const w = walletRepo.__seedFromProps({
      userId: "user-1",
      points: { sparkPoints: 100, webdevPoints: 50 },
      totalPoints: 150,
      updatedAt: new Date().toISOString(),
    });

    const result = await useCase.execute("user-1");
    expect(result).not.toBeNull();
    expect(result!.props.userId).toBe("user-1");
    expect(result!.props.totalPoints).toBe(150);
  });

  it("should return null for a user without a wallet", async () => {
    const result = await useCase.execute("ghost");
    expect(result).toBeNull();
  });
});
