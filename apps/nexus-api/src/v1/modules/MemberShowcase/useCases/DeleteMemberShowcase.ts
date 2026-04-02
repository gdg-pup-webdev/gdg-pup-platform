import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { IFileStorageService } from "../domain/IFileStorageService";

export class DeleteMemberShowcase {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly fileStorage: IFileStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const memberShowcase = await this.repo.findById(id);
    if (!memberShowcase) {
      throw new Error("Member Showcase not found.");
    }

    if (memberShowcase.props.thumbnailUrl) {
      await this.fileStorage.deleteFile(memberShowcase.props.thumbnailUrl);
    }

    await this.repo.delete(id);
  }
}
