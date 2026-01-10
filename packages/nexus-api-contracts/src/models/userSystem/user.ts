import {
  publicUserInsertSchema,
  publicUserRowSchema,
  publicUserUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicUserRowSchema;
export type row = Tables<"user">;

export const insertDTO = publicUserInsertSchema;
export type insertDTO = TablesInsert<"user">;

export const updateDTO = publicUserUpdateSchema;
export type updateDTO = TablesUpdate<"user">;
