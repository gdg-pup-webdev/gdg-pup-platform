import { IGdgMemberRepository } from "../domain/IGdgMemberRepository";
import { GdgMember } from "../domain/GdgMember";

export class FindMemberByEmail {
  constructor(private readonly repo: IGdgMemberRepository) {}

  async execute(email: string): Promise<GdgMember | null> {
    return this.repo.findByEmail(email);
  }
}
