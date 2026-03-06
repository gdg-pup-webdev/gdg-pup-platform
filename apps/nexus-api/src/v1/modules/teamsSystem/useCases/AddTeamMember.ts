import { ITeamMemberRepository } from "../domain/ITeamMemberRepository";
import { ITeamRepository } from "../domain/ITeamRepository";
import { IUserRepository } from "../domain/IUserRepository";
import { TeamMember, TeamMemberInsertProps } from "../domain/TeamMember";

export class AddTeamMember {
  constructor(
    private readonly memberRepo: ITeamMemberRepository,
    private readonly teamRepo: ITeamRepository,
    private readonly userRepo: IUserRepository // Injected cross-module validator
  ) {}

  async execute(props: TeamMemberInsertProps): Promise<TeamMember> {
    // 1. Verify User Exists
    const user = await this.userRepo.findById(props.userId);
    if (!user) throw new Error(`Cannot add member: User with ID ${props.userId} not found.`);

    // 2. Verify Team Exists
    const team = await this.teamRepo.findById(props.teamId);
    if (!team) throw new Error(`Cannot add member: Team with ID ${props.teamId} not found.`);

    // 3. Create & Save Member
    const member = TeamMember.create(props);
    return await this.memberRepo.saveNew(member);
  }
}