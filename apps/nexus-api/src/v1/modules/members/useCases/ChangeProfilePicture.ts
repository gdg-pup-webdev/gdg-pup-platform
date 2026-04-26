import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { FileToUpload, IStorageService } from "../domain/IStorageService";
import { ForbiddenError } from "@/v1/errors/HttpError";

export class ChangeProfilePicture {
  constructor(
    private readonly storage: IStorageService,
    private readonly repo: IGdgMemberRepository,
  ) {}

  async execute(actorId: string, gdgId: string, file: FileToUpload) {
    if (actorId !== gdgId) {
      throw new ForbiddenError(
        `Access denied. User '${actorId}' cannot modify member '${gdgId}'.`,
      );
    }

    const member = await this.repo.findByGdgId(gdgId);
    if (!member) throw new Error("Member not found");

    if (member.props.avatarUrl) {
      await this.storage.deleteFile(member.props.avatarUrl);
    }

    const { publicUrl, publicUrl64, publicUrl512 } = await this.storage.uploadFile(file);
    member.changeProfilePicture({
      avatarUrl: publicUrl,
      avatarUrl64: publicUrl64,
      avatarUrl512: publicUrl512,
    });
    await this.repo.persistUpdates(member);

    return member;
  }
}
