import { MemberProject } from "../domain/MemberProject";
import { IMemberProjectRepository } from "../domain/IMemberProjectRepository";
import { IFileStorage, FileToUpload } from "../domain/IFileStorage";
import { IMemberService } from "../domain/IMemberService";
import { NotFoundError, ValidationError } from "@/v1/errors/HttpError";

export type CreateMemberProjectInput = {
  title: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  images?: FileToUpload[];
  mainImage: FileToUpload | null;
  secondaryImage: FileToUpload | null;
  tertiaryImage: FileToUpload | null;
  memberGdgId: string;
};

export class CreateMemberProject {
  constructor(
    private repository: IMemberProjectRepository,
    private fileStorage: IFileStorage,
    private memberModule: IMemberService
  ) {}

  async execute(input: CreateMemberProjectInput): Promise<MemberProject> {
    const memberExists = await this.memberModule.memberExistsByGdgId(input.memberGdgId);
    if (!memberExists) {
      throw new NotFoundError(`Member with GDG ID ${input.memberGdgId} not found`);
    }

    const files: FileToUpload[] = [
      ...(input.images || []),
      input.mainImage,
      input.secondaryImage,
      input.tertiaryImage,
    ].filter((file): file is FileToUpload => Boolean(file));

    if (files.length > 4) {
      throw new ValidationError("A member project can only contain up to 4 images.");
    }

    const images: string[] = [];

    for (const file of files) {
      const uploaded = await this.fileStorage.uploadFile(file);
      images.push(uploaded.publicUrl);
    }

    const project = MemberProject.create({
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      images,
      memberGdgId: input.memberGdgId,
    });

    return await this.repository.saveNew(project);
  }
}
