import { IAchievementRepository } from "../domain/IAchievementRepository";

export interface DeleteAchievementRequest {
  id: string;
}

export class DeleteAchievementUseCase {
  constructor(private readonly repo: IAchievementRepository) {}

  async execute(request: DeleteAchievementRequest): Promise<void> {
    // 1. Verify it exists
    const existingAchievement = await this.repo.findById(request.id);
    if (!existingAchievement) {
      throw new Error(`Cannot delete: Achievement with ID ${request.id} not found.`);
    }

    // 2. Delegate the deletion to the repository
    await this.repo.delete(request.id);
  }
}