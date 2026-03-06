import { TeamMember } from "./TeamMember";

export interface TeamMemberFilters {
  teamId?: string;
  userId?: string;
  role?: string;
}

export interface ITeamMemberRepository {
  findById(id: string): Promise<TeamMember | null>;
  findAllWithFilters(pageNumber: number, pageSize: number, filters: TeamMemberFilters): Promise<{ list: TeamMember[]; count: number }>;
  saveNew(member: TeamMember): Promise<TeamMember>;
  delete(id: string): Promise<void>;
}