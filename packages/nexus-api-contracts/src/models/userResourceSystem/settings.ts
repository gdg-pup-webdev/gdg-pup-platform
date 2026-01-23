import {
  publicUserSettingsInsertSchema,
  publicUserSettingsRowSchema,
  publicUserSettingsUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserSettingsRowSchema;

export const insertDTO = publicUserSettingsInsertSchema;

export const updateDTO = publicUserSettingsUpdateSchema;
