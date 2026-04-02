import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember } from "../domain/GdgMember";

export class FindMemberByGdgId {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(gdgId: string): Promise<GdgMember | null> {
    return await this.repo.findByGdgId(gdgId);
  }
}
