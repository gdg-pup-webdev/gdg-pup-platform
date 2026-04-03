import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class ListLearningResources {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(
    pageNumber: number,
    pageSize: number,
    filters?: LearningResourceFilters
  ): Promise<{ list: LearningResource[]; count: number }> {
    return await this.repo.findAll(pageNumber, pageSize, filters);
  }
}
