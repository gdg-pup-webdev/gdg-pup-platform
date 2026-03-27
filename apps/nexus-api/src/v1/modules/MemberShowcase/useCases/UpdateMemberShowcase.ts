import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase, MemberShowcaseUpdateProps } from "../domain/MemberShowcase";
import { IFileStorageService, FileToUpload } from "../domain/IFileStorageService";

export interface UpdateMemberShowcaseInput extends Omit<MemberShowcaseUpdateProps, "thumbnailUrl"> {
  thumbnailFile?: FileToUpload;
}

export class UpdateMemberShowcase {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly fileStorage: IFileStorageService
  ) {}

  async execute(id: string, updates: UpdateMemberShowcaseInput): Promise<MemberShowcase> {
    const memberShowcase = await this.repo.findById(id);
    if (!memberShowcase) {
      throw new Error("Member Showcase not found.");
    }

    const newUpdates: MemberShowcaseUpdateProps = { ...updates } as any;

    if (updates.thumbnailFile) {
      // Delete old file if it exists
      if (memberShowcase.props.thumbnailUrl) {
        await this.fileStorage.deleteFile(memberShowcase.props.thumbnailUrl);
      }
      
      // Upload new file
      const uploadedFile = await this.fileStorage.uploadFile(updates.thumbnailFile);
      newUpdates.thumbnailUrl = uploadedFile.publicUrl;
    }

    // Remove thumbnailFile from the object that goes into domain.update
    delete (newUpdates as any).thumbnailFile;

    memberShowcase.update(newUpdates);
    return await this.repo.persistUpdates(memberShowcase);
  }
}
