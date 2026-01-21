import {
  publicEventInsertSchema,
  publicEventRowSchema,
  publicEventUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";

  export const row = publicEventRowSchema; 

  export const insertDTO = publicEventInsertSchema; 

  export const updateDTO = publicEventUpdateSchema; 