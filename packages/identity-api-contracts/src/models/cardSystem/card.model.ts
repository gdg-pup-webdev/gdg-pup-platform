import {
  publicNfcCardInsertSchema,
  publicNfcCardRowSchema,
  publicNfcCardUpdateSchema,
} from "../../types/supabase.schema.js";
import z from "zod";

export namespace CardModels {
  export const row = publicNfcCardRowSchema;
  export type row = z.infer<typeof row>;

  export const insertDTO = publicNfcCardInsertSchema;
  export type insertDTO = z.infer<typeof insertDTO>;

  export const updateDTO = publicNfcCardUpdateSchema;
  export type updateDTO = z.infer<typeof updateDTO>;
}
