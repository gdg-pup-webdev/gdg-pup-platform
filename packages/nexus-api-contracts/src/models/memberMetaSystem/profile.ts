import {
  publicUserProfileInsertSchema,
  publicUserProfileRowSchema,
  publicUserProfileUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicUserProfileRowSchema;
export type row = Tables<"user_profile">;

export const insertDTO = publicUserProfileInsertSchema;
export type insertDTO = TablesInsert<"user_profile">;

export const updateDTO = publicUserProfileUpdateSchema;
export type updateDTO = TablesUpdate<"user_profile">;
