/**
 * @file achievement.ts
 * @description Zod model definitions for User Achievements.
 * Exports Row, Insert, and Update schemas derived from the database structure.
 */

import {
  publicUserAchievementInsertSchema,
  publicUserAchievementRowSchema,
  publicUserAchievementUpdateSchema,
} from "#types/supabase.schema.js";

/** Represents a full achievement record from the database. */
export const row = publicUserAchievementRowSchema;

/** Data Transfer Object for creating a new achievement. */
export const insertDTO = publicUserAchievementInsertSchema;

/** Data Transfer Object for updating an existing achievement. */
export const updateDTO = publicUserAchievementUpdateSchema;