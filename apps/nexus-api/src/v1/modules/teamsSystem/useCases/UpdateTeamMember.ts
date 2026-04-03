import { ITeamMemberRepository } from "../domain/ITeamMemberRepository";
import { TeamMember, TeamMemberUpdateProps } from "../domain/TeamMember";

export class UpdateTeamMember {
  constructor(private readonly repo: ITeamMemberRepository) {}

  async execute(id: string, props: TeamMemberUpdateProps): Promise<TeamMember> {
    const member = await this.repo.findById(id);
    if (!member) throw new Error("Team member not found.");

    member.update(props);
    return await this.repo.persistUpdates(member);
  }
}
