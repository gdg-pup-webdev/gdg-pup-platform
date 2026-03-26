import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource, LearningResourceUpdateProps } from "../domain/LearningResource";

export class UpdateLearningResource {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(id: string, updates: LearningResourceUpdateProps): Promise<LearningResource> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error(`Cannot update: Learning resource with ID ${id} not found.`);
    }

    resource.update(updates);
    return await this.repo.persistUpdates(resource);
  }
}