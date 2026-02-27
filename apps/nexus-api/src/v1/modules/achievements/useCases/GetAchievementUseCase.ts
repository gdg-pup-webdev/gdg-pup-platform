import { IAchievementRepository } from "../domain/IAchievementRepository";
import { Achievement } from "../domain/Achievement";

export class GetAchievementUseCase {
  constructor(private readonly repo: IAchievementRepository) {}

  async execute(id: string): Promise<Achievement> {
    const achievement = await this.repo.findById(id);
    if (!achievement) throw new Error(`Achievement with ID ${id} not found.`);
    return achievement;
  }
}