import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";

export type UpdateMemberProjectInput = {
  id: string;
  title?: string;
  startDate?: Date;
  endDate?: Date | null;
  description?: string;
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
      throw new Error(`Member Project with ID ${input.id} not found`);
    }

    let mainImageUrl = undefined;
    let secondaryImageUrl = undefined;
    let tertiaryImageUrl = undefined;

    if (input.mainImage) {
      const uploaded = await this.fileStorage.uploadFile(input.mainImage);
      mainImageUrl = uploaded.publicUrl;
    }

    if (input.secondaryImage) {
      const uploaded = await this.fileStorage.uploadFile(input.secondaryImage);
      secondaryImageUrl = uploaded.publicUrl;
    }

    if (input.tertiaryImage) {
      const uploaded = await this.fileStorage.uploadFile(input.tertiaryImage);
      tertiaryImageUrl = uploaded.publicUrl;
    }

    project.update({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      mainImageUrl,
      secondaryImageUrl,
      tertiaryImageUrl,
    });

    return await this.repository.persistUpdates(project);
  }
}
