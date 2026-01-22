import {
  publicRewardInsertSchema,
  publicRewardRowSchema,
  publicRewardUpdateSchema,
} from "#types/supabase.schema.js";
import z from "zod";
import { transaction, wallet } from "../economySystem";

export const row = publicRewardRowSchema;
export const insert = publicRewardInsertSchema;
export const update = publicRewardUpdateSchema;

export const claimResponse = z.object({
  updatedReward: row,
  updatedUserWallet: wallet.row,
  transaction: transaction.row,
});
