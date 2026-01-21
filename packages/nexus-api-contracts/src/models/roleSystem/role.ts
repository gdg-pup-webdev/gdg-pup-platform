import {
  publicUserRoleInsertSchema,
  publicUserRoleRowSchema,
  publicUserRoleUpdateSchema,
} from "#types/supabase.schema.js"; 

export const row = publicUserRoleRowSchema; 

export const insertDTO = publicUserRoleInsertSchema; 

export const updateDTO = publicUserRoleUpdateSchema; 
