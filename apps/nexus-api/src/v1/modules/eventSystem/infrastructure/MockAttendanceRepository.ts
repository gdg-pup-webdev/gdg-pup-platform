import { IAttendanceRepository } from "../domain/IAttendanceRepository";
import { Attendance } from "../domain/Attendance";

export class MockAttendanceRepository implements IAttendanceRepository {
  // In-memory data store
  public attendances: Attendance[] = [];

  async persistNewAttendance(attendance: Attendance): Promise<Attendance> {
    this.attendances.push(attendance);
    return attendance;
  }

  async listAttendances(
    pageNumber: number,
    pageSize: number,
    eventId: string,
  ): Promise<{ list: Attendance[]; count: number }> {
    // Filter by event ID first
    const eventAttendances = this.attendances.filter(
      (a) => a.props.eventId === eventId
    );

    // Apply pagination
    const from = (pageNumber - 1) * pageSize;
    const to = from + pageSize;
    const paginatedList = eventAttendances.slice(from, to);

    return {
      list: paginatedList,
      count: eventAttendances.length,
    };
  }
}