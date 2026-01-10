import {
  publicWalletTransactionInsertSchema,
  publicWalletTransactionRowSchema,
  publicWalletTransactionUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicWalletTransactionRowSchema;
export type row = Tables<"wallet_transaction">;

export const insertDTO = publicWalletTransactionInsertSchema;
export type insertDTO = TablesInsert<"wallet_transaction">;

export const updateDTO = publicWalletTransactionUpdateSchema;
export type updateDTO = TablesUpdate<"wallet_transaction">;
