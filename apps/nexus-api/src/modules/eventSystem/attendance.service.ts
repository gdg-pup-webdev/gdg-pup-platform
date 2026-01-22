import { tryCatch } from "@/utils/tryCatch.util.js";
import {
  AttendanceRepository,
  attendanceRepositoryInstance,
} from "./attendance.repository.js";
import { RepositoryError } from "@/classes/ServerError.js";

export class AttendanceService {
  constructor(
    private attendanceRepository: AttendanceRepository = attendanceRepositoryInstance,
  ) {}

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

  listEventAttendees = async (eventId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.attendanceRepository.listEventAttendees(eventId),
      "listing event attendees",
    );
    if (error) throw new RepositoryError(error.message);
    if (!data) throw new RepositoryError("Failed to list event attendees.");

    return data;
  };
}

export const attendanceServiceInstance = new AttendanceService();
