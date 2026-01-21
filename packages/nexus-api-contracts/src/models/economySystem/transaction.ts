import {
  publicWalletTransactionInsertSchema,
  publicWalletTransactionRowSchema,
  publicWalletTransactionUpdateSchema,
} from "#types/supabase.schema.js"; 

  export const row = publicWalletTransactionRowSchema; 

  export const insertDTO = publicWalletTransactionInsertSchema; 

  export const updateDTO = publicWalletTransactionUpdateSchema;  