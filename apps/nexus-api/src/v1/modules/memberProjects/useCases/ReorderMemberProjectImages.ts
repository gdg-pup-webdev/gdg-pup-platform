import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type ReorderMemberProjectImagesInput = {
  projectId: string;
  fromIndex: number;
  toIndex: number;
};

export class ReorderMemberProjectImages {
  constructor(private readonly repository: IMemberProjectRepository) {}

  async execute(input: ReorderMemberProjectImagesInput) {
    const project = await this.repository.findById(input.projectId);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.projectId} not found`);
    }

    try {
      project.reorderImages(input.fromIndex, input.toIndex);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    return await this.repository.persistUpdates(project);
  }
}
