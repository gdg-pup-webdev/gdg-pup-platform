import { publicUserRoleJunctionRowSchema } from "#types/supabase.schema.js";

export const row = publicUserRoleJunctionRowSchema;

export const insert = row.omit({
  id: true,
});

export const update = insert.partial();
