import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { FileToUpload, IStorageService } from "../domain/IStorageService";

export class ChangeProfilePicture {
  constructor(
    private readonly storage: IStorageService,
    private readonly repo: IGdgMemberRepository,
  ) {}

  async execute(gdgId: string, file: FileToUpload) {
    const member = await this.repo.findByGdgId(gdgId);
    if (!member) throw new Error("Member not found");

    if (member.props.avatarUrl) {
      await this.storage.deleteFile(member.props.avatarUrl);
    }

    const { storageReference, publicUrl } = await this.storage.uploadFile(file);
    member.changeProfilePicture(publicUrl);
    await this.repo.persistUpdates(member);

    return member;
  }
}
