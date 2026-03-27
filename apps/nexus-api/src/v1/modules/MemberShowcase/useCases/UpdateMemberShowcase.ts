import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase, MemberShowcaseUpdateProps } from "../domain/MemberShowcase";

export class UpdateMemberShowcase {
  constructor(private readonly repo: IMemberShowcaseRepository) {}

  async execute(id: string, updates: MemberShowcaseUpdateProps): Promise<MemberShowcase> {
    const memberShowcase = await this.repo.findById(id);
    if (!memberShowcase) {
      throw new Error("Member Showcase not found.");
    }

    memberShowcase.update(updates);
    return await this.repo.persistUpdates(memberShowcase);
  }
}
