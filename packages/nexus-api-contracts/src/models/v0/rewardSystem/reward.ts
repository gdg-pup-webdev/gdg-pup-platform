import {
  publicRewardInsertSchema,
  publicRewardRowSchema,
  publicRewardUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

import { transaction, wallet } from "../economySystem";

export const row = publicRewardRowSchema;
export const insert = publicRewardInsertSchema;
export const update = publicRewardUpdateSchema;

export const claimResponse = z.object({
  updatedReward: row,
  updatedUserWallet: wallet.row,
  transaction: transaction.row,
});
