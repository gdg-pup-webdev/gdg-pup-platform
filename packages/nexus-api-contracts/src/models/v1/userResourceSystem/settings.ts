/**
 * @file settings.ts
 * @description Zod model definitions for User Settings.
 */

import { cz } from "@packages/typed-rest/shared";

/** Represents a full user settings record. */
export const userSettingsRow = cz.object({
  id: cz.string(),
  created_at: cz.string(),
  updated_at: cz.string(),

  user_id: cz.string(),

  theme: cz.string().nullable(),
  notifications_enabled: cz.boolean(),
  language: cz.string().nullable(),
});

/** Data Transfer Object for creating a new user settings record. */
export const userSettingsInsertDTO = userSettingsRow.omit({
  id: true,
  created_at: true,
  updated_at: true,
  user_id: true,
});

/** Data Transfer Object for updating an existing user settings record. */
export const userSettingsUpdateDTO = userSettingsInsertDTO.partial();