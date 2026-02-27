import {
  publicEventAttendanceInsertSchema,
  publicEventAttendanceRowSchema,
  publicEventAttendanceUpdateSchema,
} from "#types/supabase.schema.js";
import { Tables, TablesInsert, TablesUpdate } from "#types/supabase.types.js";

export const row = publicEventAttendanceRowSchema;

export const insertDTO = publicEventAttendanceInsertSchema;

export const updateDTO = publicEventAttendanceUpdateSchema;
