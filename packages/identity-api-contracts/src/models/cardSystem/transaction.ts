import {
  publicNfcCardTransactionInsertSchema,
  publicNfcCardTransactionRowSchema,
  publicNfcCardTransactionUpdateSchema,
} from "../../types/supabase.schema.js"; 

export const row = publicNfcCardTransactionRowSchema;

export const insertDTO = publicNfcCardTransactionInsertSchema;

export const updateDTO = publicNfcCardTransactionUpdateSchema;
