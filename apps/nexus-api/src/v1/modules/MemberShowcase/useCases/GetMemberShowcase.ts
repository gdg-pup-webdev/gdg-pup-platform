import { IMemberShowcaseRepository } from "../domain/IMemberShowcaseRepository";
import { MemberShowcase } from "../domain/MemberShowcase";
import { IMembersService } from "../domain/IMembersService";

export class GetMemberShowcase {
  constructor(
    private readonly repo: IMemberShowcaseRepository,
    private readonly membersService: IMembersService
  ) {}

  async execute(id: string): Promise<{ showcase: MemberShowcase; members: any[] }> {
    const showcase = await this.repo.findById(id);
    if (!showcase) throw new Error("Member Showcase not found.");
    
    const members = await this.membersService.findByIds(showcase.props.showcasedMembers);
    
    return { showcase, members };
  }
}
