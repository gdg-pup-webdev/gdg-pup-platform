import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { InternalServerError, NotFoundError } from "@/v1/errors/HttpError";

export class DeleteMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private fileStorage: IFileStorage,
  ) {}

  async execute(id: string): Promise<void> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${id} not found`);
    }

    for (const imageUrl of project.props.images) {
      const deleted = await this.fileStorage.deleteFile(imageUrl);
      if (!deleted) {
        throw new InternalServerError(`Failed to delete member project image: ${imageUrl}`);
      }
    }

    await this.repository.delete(id);
  }
}
