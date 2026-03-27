import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";
import { IMembersService, ShowcasedMember } from "../domain/IMembersService";

export class GetSpotlightOfTheDay {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly membersService: IMembersService
  ) {}

  async execute(): Promise<{ showcase: MemberShowcase | null; members: ShowcasedMember[] }> {
    const showcase = await this.repo.getSpotlightOfTheDay();
    if (!showcase) return { showcase: null, members: [] };

    const members = await this.membersService.findByIds(showcase.props.showcasedMembers);
    return { showcase, members };
  }
}
