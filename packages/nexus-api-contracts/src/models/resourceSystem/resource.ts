import {
  publicExternalResourceInsertSchema,
  publicExternalResourceRowSchema,
  publicExternalResourceUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";
import z from "zod";

export const row = publicExternalResourceRowSchema;
export type row = Tables<"external_resource">;

export const insertDTO = publicExternalResourceInsertSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export type insertDTO = z.infer<typeof insertDTO>;

export const updateDTO = publicExternalResourceUpdateSchema;
export type updateDTO = TablesUpdate<"external_resource">;
