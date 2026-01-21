import {
  publicExternalResourceInsertSchema,
  publicExternalResourceRowSchema,
  publicExternalResourceUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicExternalResourceRowSchema;

export const insertDTO = publicExternalResourceInsertSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  uploader_id: true,
});

export const updateDTO = publicExternalResourceUpdateSchema;
