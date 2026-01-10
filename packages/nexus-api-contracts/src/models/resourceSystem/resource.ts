import { publicResourceInsertSchema, publicResourceRowSchema, publicResourceUpdateSchema } from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export const row = publicResourceRowSchema;
export type row = Tables<"resource">;

export const insertDTO = publicResourceInsertSchema;
export type insertDTO = TablesInsert<"resource">;

export const updateDTO = publicResourceUpdateSchema;
export type updateDTO = TablesUpdate<"resource">;