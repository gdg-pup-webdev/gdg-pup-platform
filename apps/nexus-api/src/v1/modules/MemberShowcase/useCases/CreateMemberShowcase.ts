import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase, MemberShowcaseInsertProps } from "../domain/MemberShowcase";

export class CreateMemberShowcase {
  constructor(private readonly repo: IMemberShowcaseRepository) {}

  async execute(props: MemberShowcaseInsertProps): Promise<MemberShowcase> {
    if (!props.title || !props.description || !props.thumbnailUrl) {
      throw new Error("Title, description, and thumbnailUrl are required.");
    }
    
    if (!props.showcasedMembers || props.showcasedMembers.length === 0) {
      throw new Error("At least one showcased member is required.");
    }

    const memberShowcase = MemberShowcase.create(props);
    return await this.repo.saveNew(memberShowcase);
  }
}
