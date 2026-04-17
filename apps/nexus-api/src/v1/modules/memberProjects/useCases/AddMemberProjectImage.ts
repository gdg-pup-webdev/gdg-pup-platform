import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";
import { MEMBER_PROJECT_MAX_IMAGES } from "../domain/MemberProject";
import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  ValidationError,
} from "@/v1/errors/HttpError";

export type AddMemberProjectImageInput = {
  actorId: string;
  projectId: string;
  image: FileToUpload;
};

export class AddMemberProjectImage {
  constructor(
    private readonly repository: IMemberProjectRepository,
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(input: AddMemberProjectImageInput) {
    const project = await this.repository.findById(input.projectId);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.projectId} not found`);
    }

    if (input.actorId !== project.props.memberGdgId) {
      throw new ForbiddenError(
        `Access denied. User '${input.actorId}' cannot modify member '${project.props.memberGdgId}'.`,
      );
    }

    if (project.props.images.length >= MEMBER_PROJECT_MAX_IMAGES) {
      throw new ValidationError(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
    }

    const uploaded = await this.fileStorage.uploadFile(input.image);
    try {
      project.addImage(uploaded.publicUrl);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    try {
      return await this.repository.persistUpdates(project);
    } catch (error) {
      const cleaned = await this.fileStorage.deleteFile(uploaded.publicUrl);
      if (!cleaned) {
        throw new InternalServerError(
          `Failed to persist new project image and failed to clean up uploaded file: ${uploaded.publicUrl}`,
          error,
        );
      }
      throw error;
    }
  }
}
