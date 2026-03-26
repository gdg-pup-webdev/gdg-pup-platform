import { ILearningResourceRepository, LearningResourceFilters } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class ListLearningResources {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(pageNumber: number, pageSize: number, filters?: LearningResourceFilters): Promise<{ list: LearningResource[]; count: number }> {
    const safePageNumber = Math.max(1, pageNumber);
    const safePageSize = Math.max(1, pageSize);
    
    return await this.repo.findAll(safePageNumber, safePageSize, filters);
  }
}