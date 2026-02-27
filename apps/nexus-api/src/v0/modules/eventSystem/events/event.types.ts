import { Tables, TablesInsert, TablesUpdate } from "@/v0/presentation/types/supabase.types";




export type EventType = Tables<"event">;
export type EventInsertDTO = TablesInsert<"event">
export type EventUpdateDTO = TablesUpdate<"event">;
