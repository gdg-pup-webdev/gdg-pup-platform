import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type DeleteMemberProjectImageInput = {
  projectId: string;
  imageIndex: number;
};

export class DeleteMemberProjectImage {
  constructor(
    private readonly repository: IMemberProjectRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(input: DeleteMemberProjectImageInput) {
    const project = await this.repository.findById(input.projectId);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.projectId} not found`);
    }

    let imageUrl: string;
    try {
      imageUrl = project.deleteImageAt(input.imageIndex);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    const persisted = await this.repository.persistUpdates(project);

    const deleted = await this.fileStorage.deleteFile(imageUrl);
    if (!deleted) {
      // DB state is already consistent; keep request successful and surface cleanup failure in logs.
      console.error(`Failed to delete image from storage after DB update: ${imageUrl}`);
    }

    return persisted;
  }
}
