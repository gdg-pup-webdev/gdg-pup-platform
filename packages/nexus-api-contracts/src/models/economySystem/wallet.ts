import {
  publicWalletInsertSchema,
  publicWalletRowSchema,
  publicWalletUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

export const row = publicWalletRowSchema;

export const insertDTO = publicWalletInsertSchema.extend({
  balance: z.number().openapi({
    description: "The initial balance of the wallet.",
    example: 1000,
  }),
  user_id: z.string().openapi({
    description: "The unique identifier of the user who owns this wallet.",
  }),
});

export const updateDTO = publicWalletUpdateSchema.extend({
  balance: z.number().optional().openapi({
    description: "The updated balance of the wallet.",
  }),
});
