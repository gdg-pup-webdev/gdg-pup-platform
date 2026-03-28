import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";
import { ILearningResourceStorage } from "../domain/ILearningResourceStorage";

export class DeleteLearningResource {
  constructor(
    private readonly repo: ILearningResourceRepository,
    private readonly storage: ILearningResourceStorage
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error(`Learning resource with ID "${id}" not found.`);
    }

    if (existing.props.thumbnailUrl) {
      await this.storage.deleteFile(existing.props.thumbnailUrl);
    }

    await this.repo.delete(id);
  }
}
