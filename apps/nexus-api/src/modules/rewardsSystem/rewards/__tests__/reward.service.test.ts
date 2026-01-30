/**
 * Reward service unit tests.
Reward service unit tests.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  DatabaseError,
  InvalidOperationError,
  NotFoundError,
} from "../../../../classes/ServerError.js";
import {
  claimResultFixture,
  claimedRewardFixture,
  listResult,
  rewardFixture,
} from "../../__tests__/test-helpers.js";
import { RewardService } from "../reward.service.js";

const {
  repoList,
  repoCreate,
  repoGet,
  repoMarkClaimed,
  walletIncrement,
} = vi.hoisted(() => ({
  repoList: vi.fn(),
  repoCreate: vi.fn(),
  repoGet: vi.fn(),
  repoMarkClaimed: vi.fn(),
  walletIncrement: vi.fn(),
}));

vi.mock("../reward.repository.js", () => ({
  rewardRepositoryInstance: {
    list: repoList,
    createReward: repoCreate,
    getRewardById: repoGet,
    markRewardAsClaimed: repoMarkClaimed,
  },
  RewardRepository: class {},
}));

vi.mock("@/modules/economySystem/wallets/wallet.service.js", () => ({
  walletServiceInstance: {
    incrementPoints: walletIncrement,
  },
  WalletService: class {},
}));

describe("reward.service (unit)", () => {
  const service = new RewardService();

  beforeEach(() => {
    repoList.mockReset();
    repoCreate.mockReset();
    repoGet.mockReset();
    repoMarkClaimed.mockReset();
    walletIncrement.mockReset();
  });

  it("listRewardsByPage delegates to the repository", async () => {
    repoList.mockResolvedValue(listResult(rewardFixture));

    const result = await service.listRewardsByPage(1, 10);

    expect(repoList).toHaveBeenCalledWith(1, 10);
    expect(result.count).toBe(1);
  });

  it("createReward delegates to the repository", async () => {
    repoCreate.mockResolvedValue(rewardFixture);

    const result = await service.createReward(rewardFixture as any, "user-1");

    expect(repoCreate).toHaveBeenCalledTimes(1);
    expect(result.id).toBe(rewardFixture.id);
  });

  it("getReward delegates to the repository", async () => {
    repoGet.mockResolvedValue(rewardFixture);

    const result = await service.getReward(rewardFixture.id);

    expect(repoGet).toHaveBeenCalledWith(rewardFixture.id);
    expect(result.id).toBe(rewardFixture.id);
  });

  it("claimReward orchestrates get -> mark claimed -> wallet increment", async () => {
    repoGet.mockResolvedValue(rewardFixture);
    repoMarkClaimed.mockResolvedValue(claimedRewardFixture);
    walletIncrement.mockResolvedValue({
      updatedWallet: claimResultFixture.updatedUserWallet,
      transaction: claimResultFixture.transaction,
    });

    const result = await service.claimReward(rewardFixture.id);

    expect(repoGet).toHaveBeenCalledWith(rewardFixture.id);
    expect(repoMarkClaimed).toHaveBeenCalledWith(rewardFixture.id);
    expect(walletIncrement).toHaveBeenCalledWith(
      rewardFixture.user_id,
      rewardFixture.value,
      "reward",
      rewardFixture.id,
    );
    expect(result.updatedReward.is_claimed).toBe(true);
  });

  it("claimReward throws NotFoundError when reward is missing", async () => {
    repoGet.mockResolvedValue(null);

    await expect(service.claimReward("missing")).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("claimReward throws InvalidOperationError when already claimed", async () => {
    repoGet.mockResolvedValue(claimedRewardFixture);

    await expect(service.claimReward(rewardFixture.id)).rejects.toBeInstanceOf(
      InvalidOperationError,
    );
  });

  it("maps repository errors to RepositoryError-shaped failures", async () => {
    repoList.mockRejectedValue(new DatabaseError("db failure"));

    await expect(service.listRewardsByPage(1, 10)).rejects.toMatchObject({
      title: "Database Error",
      statusCode: 500,
    });
  });
});
