import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";
import { IMembersService, ShowcasedMember } from "../domain/IMembersService";

export class GetSpotlightOfTheDay {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly membersService: IMembersService
  ) {}

  async execute(): Promise<{ showcase: MemberShowcase | null; members: ShowcasedMember[] }> {
    // 1. Get total count first (using a minimal fetch)
    const { count } = await this.repo.findAll(1, 1);
    
    if (count === 0) {
      return { showcase: null, members: [] };
    }

    // 2. Determine deterministic index by day
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const index = dayOfYear % count;

    // 3. Fetch exactly one record at the calculated index
    // pageNumber is 1-based, so we use index + 1
    const { list } = await this.repo.findAll(index + 1, 1);
    
    if (list.length === 0) {
      return { showcase: null, members: [] };
    }

    const showcase = list[0];
    const members = await this.membersService.findByIds(showcase.props.showcasedMembers);
    
    return { showcase, members };
  }
}
