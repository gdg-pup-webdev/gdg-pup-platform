import { publicUserRolePermissionRowSchema } from "#types/supabase.schema.js";
import z from "zod";

export const row = publicUserRolePermissionRowSchema;

export const insert = row.omit({
  id: true,
});

export const update = insert.partial();

export const select = row;
