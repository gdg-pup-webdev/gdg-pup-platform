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

    const { count, error: countError } = await supabase
      .from("event_attendance")
      .select("*", { count: "exact", head: true })

      .eq("event_id", eventId);

    if (countError) {
      return { error: countError };
    }

    return {
      data: {
        listData: data.map((row) => row.user) as Models.userSystem.user.row[],
        count: (count || 0) as number,
      },
    };
  };
}

export const attendanceRepositoryInstance = new AttendanceRepository();
