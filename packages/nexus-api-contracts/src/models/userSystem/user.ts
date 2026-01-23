/**
 * @file user.ts
 * @description Zod model definitions for the User entity.
 * This file defines the base user schemas and the complex aggregate schema 
 * that includes all related user resources (profiles, projects, wallets, etc.).
 */

import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "#types/supabase.schema.js";
import { z } from "zod";
import { row as profileRow } from "./profile.js";
import {
  achievement,
  certificate,
  project,
  settings,
} from "../userResourceSystem/index.js";
import { wallet } from "../economySystem/index.js";

/**
 * Represents a basic user record as stored in the database.
 */
export const row = publicUserRowSchema;

/**
 * Data Transfer Object for creating a new user.
 * Includes enhanced validation for email, display name, and avatar URL.
 */
export const insertDTO = publicUserInsertSchema.extend({
  email: z.email(),
  display_name: z.string().min(2).max(50),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  avatar_url: z.url().optional().nullable(),
});

/**
 * Data Transfer Object for updating an existing user.
 * All fields are optional, with the same validation rules as insertDTO.
 */
export const updateDTO = publicUserUpdateSchema.extend({
  email: z.email().optional(),
  display_name: z.string().min(2).max(50).optional(),
  avatar_url: z.url().optional().nullable(),
});

/**
 * User Aggregate Schema
 * A comprehensive view of a user including all their associated relational data.
 * Used primarily by the User System's aggregate fetch endpoint.
 */
export const aggregate = row.extend({
  profiles: profileRow.array(),
  projects: project.row.array(),
  wallets: wallet.row.array(),
  achievements: achievement.row.array(),
  certificates: certificate.row.array(),
  settings: settings.row.array(),
});