import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember, GdgMemberUpdateProps } from "../domain/GdgMember";

export class UpdateMemberByGdgId {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(
    gdgId: string,
    updates: GdgMemberUpdateProps,
  ): Promise<GdgMember> {
    const member = await this.repo.findByGdgId(gdgId);
    if (!member) throw new Error("GdgMember not found");

    member.update(updates);
    return await this.repo.persistUpdates(member);
  }
}
