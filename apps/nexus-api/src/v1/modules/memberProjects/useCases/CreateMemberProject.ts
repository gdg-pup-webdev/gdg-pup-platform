import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";
import { IMemberModule } from "../domain/IMemberModule";

export type CreateMemberProjectInput = {
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  mainImage: FileToUpload | null;
  secondaryImage: FileToUpload | null;
  tertiaryImage: FileToUpload | null;
  memberGdgId: string;
};

export class CreateMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private fileStorage: IFileStorage,
    private memberModule: IMemberModule
  ) {}

  async execute(input: CreateMemberProjectInput): Promise<MemberProject> {
    const memberExists = await this.memberModule.memberExistsByGdgId(input.memberGdgId);
    if (!memberExists) {
      throw new Error(`Member with GDG ID ${input.memberGdgId} not found`);
    }

    let mainImageUrl = null;
    let secondaryImageUrl = null;
    let tertiaryImageUrl = null;

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

    const project = MemberProject.create({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      mainImageUrl,
      secondaryImageUrl,
      tertiaryImageUrl,
      memberGdgId: input.memberGdgId,
    });

    return await this.repository.saveNew(project);
  }
}
