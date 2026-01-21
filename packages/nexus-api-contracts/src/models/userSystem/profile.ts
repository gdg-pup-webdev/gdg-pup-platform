import {
  publicUserProfileInsertSchema,
  publicUserProfileRowSchema,
  publicUserProfileUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserProfileRowSchema;

export const insertDTO = publicUserProfileInsertSchema;

export const updateDTO = publicUserProfileUpdateSchema;
