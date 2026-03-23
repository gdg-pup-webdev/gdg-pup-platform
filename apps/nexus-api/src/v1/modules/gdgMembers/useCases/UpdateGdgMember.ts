import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember, GdgMemberUpdateProps } from "../domain/GdgMember";

export class UpdateGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(id: string, props: GdgMemberUpdateProps): Promise<GdgMember> {
    const member = await this.repo.findById(id);
    if (!member) throw new Error("GdgMember not found");

    member.update(props);
    return await this.repo.persistUpdates(member);
  }
}
