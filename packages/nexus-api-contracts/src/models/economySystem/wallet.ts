import {
  publicWalletInsertSchema,
  publicWalletRowSchema,
  publicWalletUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";

export const row = publicWalletRowSchema;

export const insertDTO = publicWalletInsertSchema;

export const updateDTO = publicWalletUpdateSchema;
