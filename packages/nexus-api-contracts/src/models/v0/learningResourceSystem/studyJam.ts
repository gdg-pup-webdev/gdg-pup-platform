import {
  publicStudyJamInsertSchema,
  publicStudyJamRowSchema,
  publicStudyJamUpdateSchema,
} from "#types/supabase.schema.js";

export const row = publicStudyJamRowSchema;

export const insert = publicStudyJamInsertSchema;

export const update = publicStudyJamUpdateSchema;
