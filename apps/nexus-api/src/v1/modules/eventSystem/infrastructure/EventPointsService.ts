// src/modules/eventSystem/infrastructure/EventPointsServiceAdapter.ts
 
import { PointSystemController } from "../../pointsSystem";
import { IEventPointsService } from "../domain/IEventPointsService";
export class EventPointsService implements IEventPointsService {
  constructor(private pointsController: PointSystemController) {}

  async awardAttendancePoints(
    userId: string,
    points: number,
    attendanceId: string,
  ): Promise<number> {
    // Here we map the Event System's generic request to the Point System's strict requirements
    const result = await this.pointsController.givePointsToUser(
      userId,
      "ATTENDANCE_REWARD", // pointsType
      points, // points
      attendanceId, // sourceReference
      "EVENT_CHECKIN", // sourceType
    );

    return result?.totalPoints || 0;
  }
}
