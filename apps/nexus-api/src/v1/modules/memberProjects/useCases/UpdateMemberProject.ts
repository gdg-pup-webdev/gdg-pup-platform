import { MemberProject, MEMBER_PROJECT_MAX_IMAGES } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";
import { InternalServerError, NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type UpdateMemberProjectInput = {
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string;
  images?: FileToUpload[];
  mainImage?: FileToUpload | null;
  secondaryImage?: FileToUpload | null;
  tertiaryImage?: FileToUpload | null;
};

export class UpdateMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private fileStorage: IFileStorage
  ) {}

  async execute(input: UpdateMemberProjectInput): Promise<MemberProject> {
    const project = await this.repository.findById(input.id);
    if (!project) {
      throw new NotFoundError(`Member Project with ID ${input.id} not found`);
    }

    const replacedImageUrls: string[] = [];

    if (input.images) {
      if (input.images.length > MEMBER_PROJECT_MAX_IMAGES) {
        throw new ValidationError(`A member project can only contain up to ${MEMBER_PROJECT_MAX_IMAGES} images.`);
      }

      const nextImageUrls: string[] = [];
      for (const file of input.images) {
        const uploaded = await this.fileStorage.uploadFile(file);
        nextImageUrls.push(uploaded.publicUrl);
      }

      replacedImageUrls.push(...project.props.images);
      try {
        project.update({ images: nextImageUrls });
      } catch (error) {
        throw new ValidationError((error as Error).message, error);
      }
    }

    const legacySlotUpdates: Array<{ slot: number; file?: FileToUpload | null }> = [
      { slot: 0, file: input.mainImage },
      { slot: 1, file: input.secondaryImage },
      { slot: 2, file: input.tertiaryImage },
    ];

    for (const update of legacySlotUpdates) {
      if (update.file === undefined || update.file === null) {
        continue;
      }

      const uploaded = await this.fileStorage.uploadFile(update.file);
      let replacedImageUrl: string | null = null;
      try {
        replacedImageUrl = project.upsertImageAt(update.slot, uploaded.publicUrl);
      } catch (error) {
        throw new ValidationError((error as Error).message, error);
      }

      if (replacedImageUrl) {
        replacedImageUrls.push(replacedImageUrl);
      }
    }

    project.update({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
    });

    const persisted = await this.repository.persistUpdates(project);

    const uniqueReplacedUrls = Array.from(new Set(replacedImageUrls));
    for (const replacedUrl of uniqueReplacedUrls) {
      const deleted = await this.fileStorage.deleteFile(replacedUrl);
      if (!deleted) {
        throw new InternalServerError(`Failed to clean up replaced image: ${replacedUrl}`);
      }
    }

    return persisted;
  }
}
