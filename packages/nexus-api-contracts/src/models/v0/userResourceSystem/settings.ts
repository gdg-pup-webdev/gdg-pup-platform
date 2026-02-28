/**
 * @file settings.ts
 * @description Zod model definitions for User Settings.
 */

import {
  publicUserSettingsInsertSchema,
  publicUserSettingsRowSchema,
  publicUserSettingsUpdateSchema,
} from "#types/supabase.schema.js";

/** Represents a full settings record from the database. */
export const row = publicUserSettingsRowSchema;

/** Data Transfer Object for creating a new settings record. */
export const insertDTO = publicUserSettingsInsertSchema;

/** Data Transfer Object for updating an existing settings record. */
export const updateDTO = publicUserSettingsUpdateSchema;