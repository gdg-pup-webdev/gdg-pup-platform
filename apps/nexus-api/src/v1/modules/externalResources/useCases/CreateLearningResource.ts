import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { LearningResource, LearningResourceInsertProps } from "../domain/LearningResource";

export class CreateLearningResource {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(props: LearningResourceInsertProps): Promise<LearningResource> {
    if (!props.title || !props.url) {
      throw new Error("Title and URL are required to create a learning resource.");
    }
    const resource = LearningResource.create(props);
    return await this.repo.saveNew(resource);
  }
}