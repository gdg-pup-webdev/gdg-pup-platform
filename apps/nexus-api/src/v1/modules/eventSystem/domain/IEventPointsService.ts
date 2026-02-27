// src/modules/eventSystem/domain/IEventPointsService.ts

export abstract class IEventPointsService {
  abstract awardAttendancePoints(
    userId: string,
    points: number,
    attendanceId: string
  ): Promise<number>; // Returns the new total points
}