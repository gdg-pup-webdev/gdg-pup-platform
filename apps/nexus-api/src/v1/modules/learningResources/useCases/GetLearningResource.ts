import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class GetLearningResource {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(id: string): Promise<LearningResource | null> {
    return await this.repo.findById(id);
  }
}
