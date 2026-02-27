import { Tables, TablesInsert } from "@/v0/presentation/types/supabase.types";


export type AttendanceType = Tables<"event_attendance">;
export type AttendanceInsertDTO = TablesInsert<"event_attendance">;
export type Attendee = Tables<"user">