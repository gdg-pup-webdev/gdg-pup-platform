import { Tables, TablesInsert, TablesUpdate } from "@/v0/types/supabase.types.js";

export type userRow = Tables<"user">;
export type userInsert = TablesInsert<"user">;
export type userUpdate = TablesUpdate<"user">;
