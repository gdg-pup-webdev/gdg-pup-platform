import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember } from "../domain/GdgMember";

export class GetOneGdgMember {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(id: string): Promise<GdgMember | null> {
    return await this.repo.findById(id);
  }
}
