import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import {
  AttendanceRepository,
  attendanceRepositoryInstance,
} from "./attendance.repository.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";

/**
 * Service for managing attendance business logic.
 * Orchestrates attendance creation and retrieval.
 */
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository = attendanceRepositoryInstance,
  ) {}

  /**
   * Creates an attendance record for a user at an event.
   *
   * @returns A promise resolving to the created attendance record.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  create = async (eventId: string, userId: string, checkinMethod: string) => {
    const data = await this.attendanceRepository.create({
      event_id: eventId,
      user_id: userId,
      checkin_method: checkinMethod,
    });

    return data;
  };

  /**
   * Fetches an attendance record for a user at an event.
   *
   * @returns A promise resolving to the attendance record or null.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
   */
  getAttendanceByEventAndUser = async (eventId: string, userId: string) => {
    const data = await this.attendanceRepository.getAttendanceByEventAndUser(
      eventId,
      userId,
    );

    return data;
  };

  /**
   * Lists attendees for an event based on filters.
   *
   * @returns A promise resolving to the list of attendees and count.
   * @throws {RepositoryError_DEPRECATED} If the repository operation fails.
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
  ) => {
    const data = await this.attendanceRepository.listEventAttendees(
      pageNumber,
      pageSize,
      filters,
    );

    return data;
  };
}

export const attendanceServiceInstance = new AttendanceService();
