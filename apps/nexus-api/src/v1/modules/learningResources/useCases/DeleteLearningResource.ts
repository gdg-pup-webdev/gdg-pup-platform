import { ILearningResourceRepository } from "../domain/ILearningResourceRepository";

export class DeleteLearningResource {
  constructor(private readonly repo: ILearningResourceRepository) {}

  async execute(id: string): Promise<boolean> {
    const resource = await this.repo.findById(id);
    if (!resource) {
      throw new Error(`Cannot delete: Learning resource with ID ${id} not found.`);
    }

    await this.repo.delete(id);
    return true;
  }
}