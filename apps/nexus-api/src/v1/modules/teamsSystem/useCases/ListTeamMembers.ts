import { ITeamMemberRepository, TeamMemberFilters } from "../domain/ITeamMemberRepository";
import { TeamMember } from "../domain/TeamMember";

export class ListTeamMembers {
  constructor(private readonly repo: ITeamMemberRepository) {}

  async execute(pageNumber: number, pageSize: number, filters: TeamMemberFilters): Promise<{ list: TeamMember[]; count: number }> {
    return await this.repo.findAllWithFilters(Math.max(1, pageNumber), Math.max(1, pageSize), filters);
  }
}