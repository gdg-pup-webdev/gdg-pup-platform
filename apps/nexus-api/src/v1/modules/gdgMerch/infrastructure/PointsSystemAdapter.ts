import { IPointsService } from "../domain/IPointsService";
import { pointSystemController } from "../../pointsSystem";

export class PointsSystemAdapter implements IPointsService {
  async consumePoints(userId: string, points: number, reason: string): Promise<void> {
    await pointSystemController.takePointsFromUser(userId, "GDG Points", points, reason, "MERCH_REDEEM");
  }
}
