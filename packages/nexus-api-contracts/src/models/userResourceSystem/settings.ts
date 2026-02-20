/**
 * @file settings.ts
 * @description Zod model definitions for User Settings.
 */

import {
  publicUserSettingsInsertSchema,
  publicUserSettingsRowSchema,
  publicUserSettingsUpdateSchema,
} from "#types/supabase.schema.js";
import { cz as z } from "@packages/typed-rest/shared";

/** Represents a full settings record from the database. */
export const row = publicUserSettingsRowSchema.extend({
  color_theme: z.boolean().openapi({
    description: "The user's preferred color theme (true for dark, false for light).",
    example: true,
  }),
});

/** Data Transfer Object for creating a new settings record. */
export const insertDTO = publicUserSettingsInsertSchema.extend({
  color_theme: z.boolean().openapi({ description: "Initial theme preference" }),
  user_id: z.string().openapi({ description: "User ID these settings belong to" }),
});

/** Data Transfer Object for updating an existing settings record. */
export const updateDTO = publicUserSettingsUpdateSchema.extend({
  color_theme: z.boolean().optional().openapi({ description: "Update theme preference" }),
});