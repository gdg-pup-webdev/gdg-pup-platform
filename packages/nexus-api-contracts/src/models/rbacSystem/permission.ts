/**
 * @file permissions.ts
 * @description Zod model definitions for User Role Permissions.
 */

import {
  publicUserRolePermissionRowSchema,
  publicUserRolePermissionInsertSchema,
  publicUserRolePermissionUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicUserRolePermissionRowSchema;

export const insert = publicUserRolePermissionInsertSchema;

export const update = publicUserRolePermissionUpdateSchema;

export const select = row;
