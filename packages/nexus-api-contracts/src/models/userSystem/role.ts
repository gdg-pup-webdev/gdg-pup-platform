import {
  publicUserRoleInsertSchema,
  publicUserRoleRowSchema,
  publicUserRoleUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicUserRoleRowSchema;
export type row = Tables<"user_role">;

export const insertDTO = publicUserRoleInsertSchema;
export type insertDTO = TablesInsert<"user_role">;

export const updateDTO = publicUserRoleUpdateSchema;
export type updateDTO = TablesUpdate<"user_role">;
