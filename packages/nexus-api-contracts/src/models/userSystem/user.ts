import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "#types/supabase.schema.js"; 

export const row = publicUserRowSchema; 

export const insertDTO = publicUserInsertSchema; 

export const updateDTO = publicUserUpdateSchema; 
