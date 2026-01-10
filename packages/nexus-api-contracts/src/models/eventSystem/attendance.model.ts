import {
  publicEventAttendanceInsertSchema,
  publicEventAttendanceRowSchema,
  publicEventAttendanceUpdateSchema,
} from "@/types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

export namespace AttendanceModels {
  export const row = publicEventAttendanceRowSchema;
  export type row = Tables<"event_attendance">;

  export const insertDTO = publicEventAttendanceInsertSchema;
  export type insertDTO = TablesInsert<"event_attendance">;

  export const updateDTO = publicEventAttendanceUpdateSchema;
  export type updateDTO = TablesUpdate<"event_attendance">;
}
