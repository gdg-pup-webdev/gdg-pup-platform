import { Attendance } from "./Attendance";

export abstract class IAttendanceRepository {
  abstract persistNewAttendance(attendance: Attendance): Promise<Attendance>;
}
