import { IAchievementRepository } from "../domain/IAchievementRepository";
import { Achievement } from "../domain/Achievement";

export interface UpdateAchievementRequest {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
}

export class UpdateAchievementUseCase {
  constructor(private readonly repo: IAchievementRepository) {}

  async execute(request: UpdateAchievementRequest): Promise<Achievement> {
    const { id, ...updateProps } = request;

    // 1. Verify the achievement exists before updating
    const existingAchievement = await this.repo.findById(id);
    if (!existingAchievement) {
      throw new Error(`Cannot update: Achievement with ID ${id} not found.`);
    }

    existingAchievement.update(updateProps); 

    // 2. You could add business logic here 
    // e.g., "Cannot update an achievement earned more than 30 days ago"

    // 3. Delegate the actual database update to the repository
    return await this.repo.persistUpdates(existingAchievement);
  }
}