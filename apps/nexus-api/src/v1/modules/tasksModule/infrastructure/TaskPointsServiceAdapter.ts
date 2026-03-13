import { PointSystemController } from "../../pointsSystem";
import { ITaskPointsService } from "../domain/ITaskPointsService";

export class TaskPointsServiceAdapter implements ITaskPointsService {
  constructor(private readonly pointsController: PointSystemController) {}

  async awardTaskCompletionPoints(
    userId: string,
    points: number,
    taskId: string,
  ): Promise<number> {
    const result = await this.pointsController.givePointsToUser(
      userId,
      "TASK_COMPLETION_REWARD",
      points,
      taskId,
      "TASK_COMPLETION",
    );

    return result?.totalPoints ?? 0;
  }
}
