import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class SearchLearningResources {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(query: string, limit: number = 10): Promise<LearningResource[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return await this.repo.search(query, limit);
  }
}
