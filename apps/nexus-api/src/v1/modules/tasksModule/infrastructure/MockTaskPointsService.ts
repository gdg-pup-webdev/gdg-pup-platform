import { ITaskPointsService } from "../domain/ITaskPointsService";

export class MockTaskPointsService implements ITaskPointsService {
  public userWallets: Record<string, number> = {};

  public transactionLog: Array<{
    userId: string;
    points: number;
    taskId: string;
  }> = [];

  async awardTaskCompletionPoints(
    userId: string,
    points: number,
    taskId: string,
  ): Promise<number> {
    this.transactionLog.push({ userId, points, taskId });

    if (this.userWallets[userId] === undefined) {
      this.userWallets[userId] = 0;
    }

    this.userWallets[userId] += points;

    return this.userWallets[userId];
  }
}
