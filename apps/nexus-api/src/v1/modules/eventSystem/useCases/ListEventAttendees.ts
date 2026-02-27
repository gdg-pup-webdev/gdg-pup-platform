import { Attendance } from "../domain/Attendance";
import { IAttendanceRepository } from "../domain/IAttendanceRepository";

export class ListEventAttendees {
  constructor(private attendanceRepository: IAttendanceRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    eventId: string,
  ): Promise<{ list: Attendance[]; count: number }> {
    const result = await this.attendanceRepository.listAttendances(
      pageNumber,
      pageSize,
      eventId,
    );
    return result;
  }
}
