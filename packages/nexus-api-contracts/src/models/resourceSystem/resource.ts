import {
  publicResourceInsertSchema,
  publicResourceRowSchema,
  publicResourceUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";
import z from "zod";

export const row = publicResourceRowSchema;
export type row = Tables<"resource">;

export const insertDTO = publicResourceInsertSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export type insertDTO = z.infer<typeof insertDTO>;

export const updateDTO = publicResourceUpdateSchema;
export type updateDTO = TablesUpdate<"resource">;
