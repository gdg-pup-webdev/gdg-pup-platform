import {
  publicRewardInsertSchema,
  publicRewardRowSchema,
  publicRewardUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

import { transaction, wallet } from "../economySystem";

export const row = publicRewardRowSchema.extend({
  title: z.string().openapi({
    description: "The name of the reward item.",
    example: "DevFest 2026 Shirt",
  }),
  description: z.string().openapi({
    description: "A detailed description of the reward.",
  }),
  value: z.number().openapi({
    description: "The cost or value of the reward in platform currency.",
    example: 500,
  }),
  is_claimed: z.boolean().openapi({
    description: "Whether the user has already claimed this reward.",
  }),
});

export const insert = publicRewardInsertSchema.extend({
  title: z.string().openapi({ description: "Reward title" }),
  description: z.string().openapi({ description: "Reward description" }),
  value: z.number().openapi({ description: "Reward point value" }),
});

export const update = publicRewardUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update reward title" }),
  description: z.string().optional().openapi({ description: "Update reward description" }),
  value: z.number().optional().openapi({ description: "Update point value" }),
  is_claimed: z.boolean().optional().openapi({ description: "Update claim status" }),
});

export const claimResponse = z.object({
  updatedReward: row.openapi({
    description: "The reward record after being claimed.",
  }),
  updatedUserWallet: wallet.row.openapi({
    description: "The user's updated wallet status after the transaction.",
  }),
  transaction: transaction.row.openapi({
    description: "The record of the transaction created for this claim.",
  }),
});
