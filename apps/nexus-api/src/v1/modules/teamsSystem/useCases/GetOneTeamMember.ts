import { ITeamMemberRepository } from "../domain/ITeamMemberRepository";
import { TeamMember } from "../domain/TeamMember";

export class GetOneTeamMember {
  constructor(private readonly repo: ITeamMemberRepository) {}

  async execute(id: string): Promise<TeamMember> {
    const member = await this.repo.findById(id);
    if (!member) throw new Error(`Team member with ID ${id} not found.`);
    return member;
  }
}