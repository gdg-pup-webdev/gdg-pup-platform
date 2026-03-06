import { IAchievementRepository } from "../domain/IAchievementRepository";
import { Achievement } from "../domain/Achievement";

export interface ListAchievementsRequest {
  userId?: string;
  pageNumber: number;
  pageSize: number;
}

export class ListAchievementsUseCase {
  constructor(private readonly repo: IAchievementRepository) {}

  async execute(req: ListAchievementsRequest): Promise<{ list: Achievement[]; count: number }> {
    return await this.repo.findAll({ userId: req.userId }, req.pageNumber, req.pageSize);
  }
}