import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class ListLearningResourcesByTag {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(
    tag: string,
    pageNumber: number,
    pageSize: number
  ): Promise<{ list: LearningResource[]; count: number }> {
    if (!tag || tag.trim().length === 0) {
      return { list: [], count: 0 };
    }
    return await this.repo.findByTag(tag, pageNumber, pageSize);
  }
}
