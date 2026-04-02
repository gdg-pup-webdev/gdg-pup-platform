import { IGdgMerchRepository } from "../domain/IGdgMerchRepository";
import { IPointsService } from "../domain/IPointsService";
import { GdgMerch } from "../domain/GdgMerch";

export class RedeemGdgMerch {
  constructor(
    private readonly repo: IGdgMerchRepository,
    private readonly pointsService: IPointsService
  ) {}

  async execute(userId: string, id: string): Promise<GdgMerch> {
    const merch = await this.repo.findById(id);
    if (!merch) {
      throw new Error(`Cannot redeem: Merch with ID ${id} not found.`);
    }

    merch.consumeStock(1);
    await this.pointsService.consumePoints(userId, merch.props.points, `Redeemed merch: ${merch.props.name}`);
    return await this.repo.persistUpdates(merch);
  }
}
