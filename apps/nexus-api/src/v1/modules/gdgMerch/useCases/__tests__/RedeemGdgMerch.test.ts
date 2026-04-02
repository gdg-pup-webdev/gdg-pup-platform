import { describe, it, expect, beforeEach, vi } from "vitest";
import { RedeemGdgMerch } from "../RedeemGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { IPointsService } from "../../domain/IPointsService";
import { GdgMerch } from "../../domain/GdgMerch";

class MockPointsService implements IPointsService {
  public consumedPointsCalls: { userId: string; points: number; reason: string }[] = [];

  async consumePoints(userId: string, points: number, reason: string): Promise<void> {
    this.consumedPointsCalls.push({ userId, points, reason });
  }
}

describe("RedeemGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let pointsService: MockPointsService;
  let redeemGdgMerch: RedeemGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    pointsService = new MockPointsService();
    redeemGdgMerch = new RedeemGdgMerch(repo, pointsService);
  });

  it("should successfully redeem merch, consume stock, and consume points", async () => {
    const merch = GdgMerch.create({
      name: "GDG Cap",
      image: "cap.png",
      points: 50,
      stock: 10,
    });
    await repo.saveNew(merch);

    const spyPersistUpdates = vi.spyOn(repo, "persistUpdates");
    const spyConsumePoints = vi.spyOn(pointsService, "consumePoints");

    const result = await redeemGdgMerch.execute("user-1", merch.props.id);

    // Assert domain logic changes
    expect(result.props.stock).toBe(9); // 1 consumed

    // Assert repository and service calls
    expect(spyPersistUpdates).toHaveBeenCalledTimes(1);
    expect(spyConsumePoints).toHaveBeenCalledTimes(1);
    expect(spyConsumePoints).toHaveBeenCalledWith("user-1", 50, "Redeemed merch: GDG Cap");

    expect(pointsService.consumedPointsCalls.length).toBe(1);
  });

  it("should throw an error if the merch does not exist", async () => {
    await expect(redeemGdgMerch.execute("user-1", "fake-id")).rejects.toThrow(
      "Cannot redeem: Merch with ID fake-id not found."
    );

    // Points service should not be called
    expect(pointsService.consumedPointsCalls.length).toBe(0);
  });

  it("should throw an error if the merch has 0 stock", async () => {
    const merch = GdgMerch.create({
      name: "GDG Sold Out Cap",
      image: "cap.png",
      points: 50,
      stock: 0,
    });
    await repo.saveNew(merch);

    await expect(redeemGdgMerch.execute("user-1", merch.props.id)).rejects.toThrow(
      "Not enough stock."
    );

    // Points service should not be called
    expect(pointsService.consumedPointsCalls.length).toBe(0);
  });

  it("should not persist changes if points service throws an error", async () => {
    const merch = GdgMerch.create({
      name: "GDG Cap",
      image: "cap.png",
      points: 50,
      stock: 10,
    });
    await repo.saveNew(merch);

    vi.spyOn(pointsService, "consumePoints").mockRejectedValueOnce(new Error("Insufficient points"));

    await expect(redeemGdgMerch.execute("user-1", merch.props.id)).rejects.toThrow(
      "Insufficient points"
    );

    // Since points service throws before persistUpdates, the actual persisted stock shouldn't be affected
    // We check the repository again (re-query) to ensure stock didn't get persisted
    const savedMerch = await repo.findById(merch.props.id);
    expect(savedMerch?.props.stock).toBe(10); // Original stock is maintained
  });
});
