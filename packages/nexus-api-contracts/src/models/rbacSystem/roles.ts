import { publicUserRoleRowSchema } from "#types/supabase.schema.js";
import z from "zod";

export const row = publicUserRoleRowSchema;

export const insert = row.omit({
  id: true,
});

export const update = insert.partial();
