/**
 * @file roles.ts
 * @description Zod model definitions for User Roles.
 */

import {
  publicUserRoleRowSchema,
  publicUserRoleInsertSchema,
  publicUserRoleUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserRoleRowSchema;

export const insert = publicUserRoleInsertSchema;

export const update = publicUserRoleUpdateSchema;
