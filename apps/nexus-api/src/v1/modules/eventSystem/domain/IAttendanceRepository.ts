import { Attendance } from "./Attendance";

export abstract class IAttendanceRepository {
  abstract persistNewAttendance(attendance: Attendance): Promise<Attendance>;

  abstract listAttendances(
    pageNumber: number,
    pageSize: number,
    eventId: string,
  ): Promise<{ list: Attendance[]; count: number }>;
}
