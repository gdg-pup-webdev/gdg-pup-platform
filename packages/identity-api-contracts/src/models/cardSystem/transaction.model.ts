import {
  publicNfcCardTransactionInsertSchema,
  publicNfcCardTransactionRowSchema,
  publicNfcCardTransactionUpdateSchema,
} from "../../types/supabase.schema.js";
import z from "zod";

export namespace CardTransactionModels {
  export const row = publicNfcCardTransactionRowSchema;
  export type row = z.infer<typeof row>;

  export const insertDTO = publicNfcCardTransactionInsertSchema;
  export type insertDTO = z.infer<typeof insertDTO>;

  export const updateDTO = publicNfcCardTransactionUpdateSchema;
  export type updateDTO = z.infer<typeof updateDTO>;
}
