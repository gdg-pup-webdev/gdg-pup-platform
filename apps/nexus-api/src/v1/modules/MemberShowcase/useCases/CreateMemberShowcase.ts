import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase, MemberShowcaseInsertProps } from "../domain/MemberShowcase";
import { IFileStorageService, FileToUpload } from "../domain/IFileStorageService";

export interface CreateMemberShowcaseInput extends Omit<MemberShowcaseInsertProps, "thumbnailUrl"> {
  thumbnailFile: FileToUpload;
}

export class CreateMemberShowcase {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly fileStorage: IFileStorageService
  ) {}

  async execute(input: CreateMemberShowcaseInput): Promise<MemberShowcase> {
    if (!input.title || !input.description || !input.thumbnailFile) {
      throw new Error("Title, description, and thumbnailFile are required.");
    }
    
    if (!input.showcasedMembers || input.showcasedMembers.length === 0) {
      throw new Error("At least one showcased member is required.");
    }

    // Upload the file first
    const uploadedFile = await this.fileStorage.uploadFile(input.thumbnailFile);

    const memberShowcase = MemberShowcase.create({
      ...input,
      thumbnailUrl: uploadedFile.publicUrl
    });

    return await this.repo.saveNew(memberShowcase);
  }
}
