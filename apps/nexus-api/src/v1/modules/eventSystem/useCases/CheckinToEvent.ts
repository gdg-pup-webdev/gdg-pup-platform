// src/modules/eventSystem/useCases/CheckinToEvent.ts

import { IEventRepository } from "../domain/IEventRepository";
import { IAttendanceRepository } from "../domain/IAttendanceRepository";
import { IEventPointsService } from "../domain/IEventPointsService";

export class CheckinToEvent {
  constructor(
    private eventRepository: IEventRepository,
    private attendanceRepository: IAttendanceRepository,
    private pointsService: IEventPointsService, // Inject the interface
  ) {}

  async execute(eventId: string, userId: string, checkInMethod: string) {
    // 1. Load event
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw new Error("Event not found");

    // 2. Add attendance (This should ideally generate an ID! See note below)
    const attendance = event.addAttendance(userId, checkInMethod);

    // 3. Persist Event (count goes up)
    const updatedEvent = await this.eventRepository.persistUpdates(event);

    // 4. Persist new Attendance record
    const newAttendanceRecord =
      await this.attendanceRepository.persistNewAttendance(attendance);

    // 5. Cross-Domain Call: Award points using the new attendance ID
    const newTotalPoints = await this.pointsService.awardAttendancePoints(
      userId,
      event.props.attendance_points,
      newAttendanceRecord.props.id,
    );

    return {
      attendanceRecord: newAttendanceRecord,
      attendeeNumber: updatedEvent.props.attendees_count,
      newTotalPoints: newTotalPoints,
    };
  }
}
