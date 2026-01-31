import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import { RepositoryResult, RespositoryResultList } from "@/types/repository.types.js";
import { models } from "@packages/nexus-api-contracts";

/**
 * Repository for managing event attendance records.
 * Handles direct interactions with the 'event_attendance' table.
 */
export class AttendanceRepository {
  tableName = "event_attendance";

  /**
   * Creates a new attendance record.
   *
   * @returns A promise resolving to the created attendance record.
   * @throws {DatabaseError} If a database error occurs.
   */
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

  /**
   * Fetches an attendance record for a specific event and user.
   *
   * @returns A promise resolving to the attendance record or null if not found.
   * @throws {DatabaseError} If a database error occurs.
   */
  getAttendanceByEventAndUser = async (
    eventId: string,
    userId: string,
  ): RepositoryResult<models.eventSystem.attendance.row | null> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  /**
   * Lists attendees for a specific event with optional filters and pagination.
   * Joins with the user table to return user details.
   *
   * @returns A promise resolving to a list of users (attendees) and the total count.
   * @throws {DatabaseError} If a database error occurs.
   */
  listEventAttendees = async (
    pageNumber: number,
    pageSize: number,
    filters: {
      event_id: string;
      user_id?: string;
      checkin_method?: string;
      is_present?: boolean;
      created_at_gte?: string;
      created_at_lte?: string;
    },
  ): RespositoryResultList<models.eventSystem.attendee.row> => {
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from(this.tableName).select("*, user(*)", {
      count: "exact",
    });

    query = query.eq("event_id", filters.event_id);

    if (filters.user_id) {
      query = query.eq("user_id", filters.user_id);
    }
    if (filters.checkin_method) {
      query = query.eq("checkin_method", filters.checkin_method);
    }
    if (filters.is_present !== undefined) {
      query = query.eq("is_present", filters.is_present);
    }
    if (filters.created_at_gte) {
      query = query.gte("created_at", filters.created_at_gte);
    }
    if (filters.created_at_lte) {
      query = query.lte("created_at", filters.created_at_lte);
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new DatabaseError(error.message);

    return {
      list: (data || []).map((row) => row.user),
      count: count ?? 0,
    };
  };
}

export const attendanceRepositoryInstance = new AttendanceRepository();
