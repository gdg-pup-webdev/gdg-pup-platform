import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";
import { MEMBER_PROJECT_MAX_IMAGES } from "../domain/MemberProject";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type AddMemberProjectImageInput = {
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

    if (project.props.images.length >= MEMBER_PROJECT_MAX_IMAGES) {
      throw new ValidationError(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
    }

    const uploaded = await this.fileStorage.uploadFile(input.image);
    try {
      project.addImage(uploaded.publicUrl);
    } catch (error) {
      throw new ValidationError((error as Error).message, error);
    }

    return await this.repository.persistUpdates(project);
  }
}
