import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  AttendanceRepository,
  attendanceRepositoryInstance,
} from "./attendance.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";

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
   * @throws {RepositoryError} If the repository operation fails.
   */
  create = async (eventId: string, userId: string, checkinMethod: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.attendanceRepository.create({
          event_id: eventId,
          user_id: userId,
          checkin_method: checkinMethod,
        }),
      "creating attendance record",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new RepositoryError("Failed to create attendance record.");

    return data;
  };

  /**
   * Fetches an attendance record for a user at an event.
   *
   * @returns A promise resolving to the attendance record or null.
   * @throws {RepositoryError} If the repository operation fails.
   */
  getAttendanceByEventAndUser = async (eventId: string, userId: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.attendanceRepository.getAttendanceByEventAndUser(eventId, userId),
      "fetching attendance by event and user",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  /**
   * Lists attendees for an event based on filters.
   *
   * @returns A promise resolving to the list of attendees and count.
   * @throws {RepositoryError} If the repository operation fails.
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
    const { data, error } = await tryCatch(
      async () =>
        await this.attendanceRepository.listEventAttendees(pageNumber, pageSize, filters),
      "listing event attendees",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new RepositoryError("Failed to list event attendees.");

    return data;
  };
}

export const attendanceServiceInstance = new AttendanceService();
