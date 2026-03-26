export abstract class ITaskPointsService {
  /**
   * Awards points to a user upon task completion.
   * Returns the user's new total points balance.
   */
  abstract awardTaskCompletionPoints(
    userId: string,
    points: number,
    taskId: string,
  ): Promise<number>;
}
