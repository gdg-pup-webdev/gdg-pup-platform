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
import { cz as z } from "@packages/typed-rest/shared";

/** Represents a full achievement record from the database. */
export const row = publicUserAchievementRowSchema.extend({
  title: z.string().openapi({
    description: "The name of the achievement.",
    example: "First Pull Request",
  }),
  description: z.string().nullable().openapi({
    description: "A description of how the achievement was earned.",
  }),
  image_url: z.string().nullable().openapi({
    description: "URL to the achievement badge image.",
  }),
});

/** Data Transfer Object for creating a new achievement. */
export const insertDTO = publicUserAchievementInsertSchema.extend({
  title: z.string().openapi({ description: "Achievement title" }),
  description: z.string().optional().nullable().openapi({ description: "Achievement description" }),
  user_id: z.string().openapi({ description: "User ID receiving the achievement" }),
});

/** Data Transfer Object for updating an existing achievement. */
export const updateDTO = publicUserAchievementUpdateSchema.extend({
  title: z.string().optional().openapi({ description: "Update achievement title" }),
  description: z.string().optional().nullable().openapi({ description: "Update description" }),
});