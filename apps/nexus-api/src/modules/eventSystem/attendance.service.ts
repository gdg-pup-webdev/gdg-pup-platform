import { Models } from "@packages/nexus-api-contracts";
import {
  AttendanceRepository,
  attendanceRepositoryInstance,
} from "./attendance.repository.js";
import { ServerError } from "../../classes/ServerError.js";

export class AttendanceService {
  constructor(
    private attendanceRepository: AttendanceRepository = attendanceRepositoryInstance
  ) {}

  create = async (eventId: string, userId: string, checkinMethod: string) => {
    const { data, error } = await this.attendanceRepository.create({
      event_id: eventId,
      user_id: userId,
      checkin_method: checkinMethod,
    });
    if (error) {
      return { error };
    }
    return { data : data as Models.eventSystem.attendance.row };
  };

  listEventAttendees = async (eventId: string) => {
    const { data, error } =
      await this.attendanceRepository.listEventAttendees(eventId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const attendanceServiceInstance = new AttendanceService();
