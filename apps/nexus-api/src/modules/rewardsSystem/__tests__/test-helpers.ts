/**
 * Shared fixtures for rewardsSystem tests.
 */
export const rewardsPagination = {
  pageNumber: 1,
  pageSize: 10,
} as const;

export const rewardFixture = {
  id: "reward-1",
  title: "Free Coffee",
  description: "Redeem for one coffee.",
  user_id: "user-1",
  value: 25,
  is_claimed: false,
  created_at: "2026-01-01T00:00:00.000Z",
} as const;

export const claimedRewardFixture = {
  ...rewardFixture,
  is_claimed: true,
} as const;

export const walletFixture = {
  id: "wallet-1",
  user_id: "user-1",
  balance: 125,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
} as const;

export const transactionFixture = {
  id: "txn-1",
  wallet_id: "wallet-1",
  amount: rewardFixture.value,
  source_type: "reward",
  source_id: rewardFixture.id,
  created_at: "2026-01-01T00:00:00.000Z",
} as const;

export const claimResultFixture = {
  updatedReward: claimedRewardFixture,
  updatedUserWallet: walletFixture,
  transaction: transactionFixture,
} as const;

export const listResult = <T>(item: T) => ({
  list: [item],
  count: 1,
});
