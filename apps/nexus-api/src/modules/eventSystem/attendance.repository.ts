import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RespositoryResultList } from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

export class AttendanceRepository {
  tableName = "event_attendance";

  constructor() {}

  create = async (
    dto: models.eventSystem.attendance.insertDTO,
  ): Promise<models.eventSystem.attendance.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };

  listEventAttendees = async (
    eventId: string,
  ): RespositoryResultList<models.eventSystem.attendance.row> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*, user(*)")
      .eq("event_id", eventId);
    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data.map((row) => row.user),
      count: count || 0,
    };
  };
}

export const attendanceRepositoryInstance = new AttendanceRepository();
