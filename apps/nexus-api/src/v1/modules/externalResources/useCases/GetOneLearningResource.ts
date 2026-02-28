import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource } from "../domain/LearningResource";

export class GetOneLearningResource {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(id: string): Promise<LearningResource> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error(`Learning resource with ID ${id} not found.`);
    }
    return resource;
  }
}