import { IEventPointsService } from "../domain/IEventPointsService";

export class MockEventPointsService implements IEventPointsService {
  // Store user points in memory
  public userWallets: Record<string, number> = {};

  // Keep an audit log of transactions so we can assert against them in tests
  public transactionLog: Array<{
    userId: string;
    points: number;
    attendanceId: string;
  }> = [];

  async awardAttendancePoints(
    userId: string,
    points: number,
    attendanceId: string,
  ): Promise<number> {
    // 1. Log the transaction for test assertions
    this.transactionLog.push({ userId, points, attendanceId });

    // 2. Initialize wallet if it doesn't exist
    if (this.userWallets[userId] === undefined) {
      this.userWallets[userId] = 0;
    }

    // 3. Add points
    this.userWallets[userId] += points;

    // 4. Return new total
    return this.userWallets[userId];
  }
}
