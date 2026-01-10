import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/nexus-api-contracts";

export class AttendanceRepository {
  constructor() {}

  create = async (dto: Models.eventSystem.attendance.insertDTO) => {
    const { data, error } = await supabase
      .from("event_attendance")
      .insert(dto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  listEventAttendees = async (eventId: string) => {
    const { data, error } = await supabase
      .from("event_attendance")
      .select("*, user(*)")
      .eq("event_id", eventId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const attendanceRepositoryInstance = new AttendanceRepository();
