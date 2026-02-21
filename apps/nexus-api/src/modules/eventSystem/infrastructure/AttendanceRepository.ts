import { supabase } from "@/lib/supabase.js";
import { handlePostgresError } from "@/lib/supabase.utils";
import { models } from "@packages/nexus-api-contracts";
import { Attendance } from "../domain/Attendance";
import { IAttendanceRepository } from "../domain/IAttendanceRepository";

export class AttendanceRepository implements IAttendanceRepository {
  private readonly tableName = "event_attendance";

  private mapToDomain(row: any): Attendance {
    return Attendance.hydrate({
      id: row.id,
      userId: row.user_id,
      eventId: row.event_id,
      checkInMethod: row.checkin_method,
      checkedInAt: new Date(row.created_at),
    });
  }

  async persistNewAttendance(attendance: Attendance): Promise<Attendance> {
    const props = attendance.props;

    const dto = {
      user_id: props.userId,
      event_id: props.eventId,
      checkin_method: props.checkInMethod,
      created_at: props.checkedInAt.toISOString(),
    } as models.eventSystem.attendance.insertDTO;

    // Directly interact with Supabase, cutting out the legacy repo
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();

    if (error) handlePostgresError(error);

    return this.mapToDomain(data);
  }

  async listAttendances(
    pageNumber: number,
    pageSize: number,
    eventId: string,
  ): Promise<{ list: Attendance[]; count: number }> {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    // Directly query Supabase using the internal tableName
    const { data, count, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) handlePostgresError(error);

    return {
      list: (data || []).map((row) => this.mapToDomain(row)),
      count: count ?? 0,
    };
  }
}
