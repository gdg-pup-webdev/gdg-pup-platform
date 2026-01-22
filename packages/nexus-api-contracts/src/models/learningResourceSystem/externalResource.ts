import { publicExternalResourceRowSchema } from "#types/supabase.schema.js";
import z from "zod";

export const row = publicExternalResourceRowSchema;

export const insert = row.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export const update = insert.partial();
