/**
 * @file reward.ts
 * @description Zod model definitions for the Reward entity.
 */

import { cz } from "@packages/typed-rest/shared";

import { userPointsTransactionRow } from "../economySystem/transaction.js";
import { userPoints } from "../economySystem/wallet.js";

/** Represents a full reward record. */
export const rewardRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),

  user_id: cz.string(),

  title: cz.string(),
  description: cz.string(),
  value: cz.number(),
  is_claimed: cz.boolean(),
});

/** Data Transfer Object for creating a new reward. */
export const rewardInsertDTO = rewardRow.omit({
  id: true,
  created_at: true,
  is_claimed: true,
});

/** Data Transfer Object for updating an existing reward. */
export const rewardUpdateDTO = rewardInsertDTO.partial();

/** Response schema for claiming a reward. */
export const rewardClaimResponse = cz.object({
  updatedReward: rewardRow,
  updatedUserWallet: userPoints,
  transaction: userPointsTransactionRow,
});
