/**
 * Reward repository unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
 
import { rewardFixture } from "../../__tests__/test-helpers.js";
import { RewardRepository } from "../reward.repository.js";
import { ServerError } from "@/errors/ServerError.js";

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }));

vi.mock("../../../../lib/supabase.js", () => ({
  supabase: { from: fromMock },
}));

describe("reward.repository (unit)", () => {
  const repository = new RewardRepository();

  beforeEach(() => {
    fromMock.mockReset();
  });

  it("list uses order + range and returns list + count", async () => {
    const rangeMock = vi.fn().mockResolvedValue({
      data: [rewardFixture],
      error: null,
    });
    const orderMock = vi.fn().mockReturnValue({ range: rangeMock });
    const selectListMock = vi.fn().mockReturnValue({ order: orderMock });

    const selectCountMock = vi.fn().mockResolvedValue({ count: 1, error: null });

    fromMock
      .mockReturnValueOnce({ select: selectListMock })
      .mockReturnValueOnce({ select: selectCountMock });

    const result = await repository.list(1, 10);

    expect(fromMock).toHaveBeenNthCalledWith(1, "reward");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(rangeMock).toHaveBeenCalledWith(0, 9);
    expect(result.count).toBe(1);
  });

  it("getRewardById queries by id", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: rewardFixture, error: null });
    const eqMock = vi.fn().mockReturnValue({ single: singleMock });
    const selectMock = vi.fn().mockReturnValue({ eq: eqMock });

    fromMock.mockReturnValue({ select: selectMock });

    const result = await repository.getRewardById(rewardFixture.id);

    expect(eqMock).toHaveBeenCalledWith("id", rewardFixture.id);
    expect(result.id).toBe(rewardFixture.id);
  });

  it("markRewardAsClaimed updates is_claimed", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: rewardFixture, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

    fromMock.mockReturnValue({ update: updateMock });

    await repository.markRewardAsClaimed(rewardFixture.id);

    expect(updateMock).toHaveBeenCalledWith({ is_claimed: true });
    expect(eqMock).toHaveBeenCalledWith("id", rewardFixture.id);
  });

  it("maps supabase errors to DatabaseError", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: { message: "db failure" } });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });

    fromMock.mockReturnValue({ insert: insertMock });

    await expect(repository.createReward(rewardFixture as any)).rejects.toBeInstanceOf(
      ServerError,
    );
  });
});
