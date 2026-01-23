import {
  publicUserAchievementInsertSchema,
  publicUserAchievementRowSchema,
  publicUserAchievementUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserAchievementRowSchema;

export const insertDTO = publicUserAchievementInsertSchema;

export const updateDTO = publicUserAchievementUpdateSchema;
