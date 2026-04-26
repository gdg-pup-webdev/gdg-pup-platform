import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage } from "../domain/IFileStorage";
import { ForbiddenError, NotFoundError } from "@/v1/errors/HttpError";

export class DeleteMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private fileStorage: IFileStorage,
  ) {}

  async execute(actorId: string, id: string): Promise<void> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${id} not found`);
    }

    if (actorId !== project.props.memberGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify member '${project.props.memberGdgId}'.`,
      );
    }

    const imageUrls = [...project.props.images];

    await this.repository.delete(id);

    for (const imageUrl of imageUrls) {
      const deleted = await this.fileStorage.deleteFile(imageUrl);
      if (!deleted) {
        // Project is already deleted from DB; keep request successful and surface cleanup failure in logs.
        console.error(`Failed to delete member project image from storage: ${imageUrl}`);
      }
    }
  }
}
