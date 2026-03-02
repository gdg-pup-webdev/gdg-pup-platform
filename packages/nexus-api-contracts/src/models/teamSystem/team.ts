import {
  publicTeamInsertSchema,
  publicTeamRowSchema,
  publicTeamUpdateSchema,
} from "#types/supabase.schema.js";
 

export const row = publicTeamRowSchema;

export const insert = publicTeamInsertSchema;

export const update = publicTeamUpdateSchema;
