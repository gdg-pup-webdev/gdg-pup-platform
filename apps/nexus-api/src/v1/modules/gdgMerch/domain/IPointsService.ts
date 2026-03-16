export abstract class IPointsService {
  abstract consumePoints(userId: string, points: number, reason: string): Promise<void>;
}
