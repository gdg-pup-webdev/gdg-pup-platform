import {
  publicWalletTransactionInsertSchema,
  publicWalletTransactionRowSchema,
  publicWalletTransactionUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicWalletTransactionRowSchema;

export const insertDTO = publicWalletTransactionInsertSchema.extend({
  amount: z.number().openapi({
    description: "The amount of the transaction. Positive for credits, negative for debits.",
    example: 50.50,
  }),
  source_id: z.string().openapi({
    description: "The identifier of the resource that triggered the transaction (e.g., an order ID).",
  }),
  source_type: z.string().openapi({
    description: "The type of the source resource (e.g., 'event', 'reward', 'purchase').",
    example: "reward",
  }),
  wallet_id: z.string().openapi({
    description: "The ID of the wallet involved in this transaction.",
  }),
});

export const updateDTO = publicWalletTransactionUpdateSchema.extend({
  amount: z.number().optional().openapi({
    description: "Update the transaction amount.",
  }),
  source_id: z.string().optional().openapi({
    description: "Update the source resource ID.",
  }),
  source_type: z.string().optional().openapi({
    description: "Update the source resource type.",
  }),
});
