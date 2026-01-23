import z from "zod";
import {
  publicNfcCardInsertSchema,
  publicNfcCardRowSchema,
  publicNfcCardUpdateSchema,
} from "../../types/supabase.schema.js";

export const row = publicNfcCardRowSchema;

export const insertDTO = publicNfcCardInsertSchema;

export const updateDTO = publicNfcCardUpdateSchema;

// Body Schema for POST /cards/activate
export const activateCardDTO = z.object({
  cardUid: z.string(),
  userId: z.string(),
});

// Response Schema for GET /cards/:cardUid/status
export const cardStatus = z.object({
  card: row,
  user: row.nullable(),
});
