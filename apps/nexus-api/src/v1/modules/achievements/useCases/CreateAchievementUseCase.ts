import { IAchievementRepository } from "../domain/IAchievementRepository";
import { Achievement } from "../domain/Achievement";

export interface CreateAchievementRequest {
  userId: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export class CreateAchievementUseCase {
  constructor(private readonly repo: IAchievementRepository) {}

  async execute(req: CreateAchievementRequest): Promise<Achievement> {
    // 1. Create the domain entity (business logic validation can happen inside the entity)
    const achievement = Achievement.create(req);
    
    // 2. Persist it
    return await this.repo.saveNew(achievement);
  }
}