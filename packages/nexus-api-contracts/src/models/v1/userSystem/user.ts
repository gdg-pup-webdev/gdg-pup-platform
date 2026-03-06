/**
 * @file user.ts
 * @description Zod model definitions for the User entity.
 * This file defines the base user schemas and the complex aggregate schema
 * that includes all related user resources (profiles, projects, wallets, etc.).
 */

import { cz as z } from "@packages/typed-rest/shared";

import { userProfileRow } from "./profile.js";
import { userAchievementRow } from "../userResourceSystem/achievement.js";
import { certificateRow } from "../userResourceSystem/certificate.js";
import { projectRow } from "../userResourceSystem/project.js";
import { userSettingsRow } from "../userResourceSystem/settings.js";
import { userPoints } from "../economySystem/wallet.js";

/**
 * Represents a basic user record.
 */
export const userRow = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),

  avatar_url: z.string().nullable(),
  display_name: z.string(),
  email: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  gdg_id: z.string().nullable(),
  status: z.string(),
});

/**
 * Data Transfer Object for creating a new user.
 * Includes enhanced validation for email, display name, and avatar URL.
 */
export const userInsertDTO = userRow
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    status: true,
  })
  .extend({
    email: z.email(),
    display_name: z.string().min(2).max(50),
    avatar_url: z.url().optional().nullable(),
  });

/**
 * Data Transfer Object for updating an existing user.
 * All fields are optional, with the same validation rules as insertDTO.
 */
export const userUpdateDTO = userRow
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    status: true,
  })
  .partial()
  .extend({
    email: z.email().optional(),
    display_name: z.string().min(2).max(50).optional(),
    avatar_url: z.url().optional().nullable(),
  });

/**
 * User Aggregate Schema
 * A comprehensive view of a user including all their associated relational data.
 * Used primarily by the User System's aggregate fetch endpoint.
 */
export const userAggregate = userRow.extend({
  profiles: userProfileRow.array(),
  projects: projectRow.array(),
  wallets: userPoints.array(),
  achievements: userAchievementRow.array(),
  certificates: certificateRow.array(),
  settings: userSettingsRow.array(),
});