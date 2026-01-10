import {
  publicWalletInsertSchema,
  publicWalletRowSchema,
  publicWalletUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicWalletRowSchema;
export type row = Tables<"wallet">;

export const insertDTO = publicWalletInsertSchema;
export type insertDTO = TablesInsert<"wallet">;

export const updateDTO = publicWalletUpdateSchema;
export type updateDTO = TablesUpdate<"wallet">;
