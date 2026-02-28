import { TeamMemberFilters } from "./domain/ITeamMemberRepository";
import { Team } from "./domain/Team";
import { TeamMember } from "./domain/TeamMember";
import { AddTeamMember } from "./useCases/AddTeamMember";
import { CreateTeam } from "./useCases/CreateTeam";
import { DeleteTeam } from "./useCases/DeleteTeam";
import { GetOneTeam } from "./useCases/GetOneTeam";
import { ListTeamMembers } from "./useCases/ListTeamMembers";
import { ListTeams } from "./useCases/ListTeams";
import { RemoveTeamMember } from "./useCases/RemoveTeamMember";
import { UpdateTeam } from "./useCases/UpdateTeam";

 
export interface TeamResponseDTO {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface TeamMemberResponseDTO {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
}

export class TeamModuleController {
  constructor(
    // Team Use Cases
    private readonly createTeamUC: CreateTeam,
    private readonly getOneTeamUC: GetOneTeam,
    private readonly updateTeamUC: UpdateTeam,
    private readonly deleteTeamUC: DeleteTeam,
    private readonly listTeamsUC: ListTeams,
    // Team Member Use Cases
    private readonly addMemberUC: AddTeamMember,
    private readonly removeMemberUC: RemoveTeamMember,
    private readonly listMembersUC: ListTeamMembers
  ) {}

  /** * DTO Mappers 
   */
  private toTeamDTO(team: Team): TeamResponseDTO {
    const p = team.props;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    };
  }

  private toMemberDTO(member: TeamMember): TeamMemberResponseDTO {
    const p = member.props;
    return {
      id: p.id,
      teamId: p.teamId,
      userId: p.userId,
      role: p.role,
      joinedAt: p.joinedAt.toISOString(),
    };
  }

  /**
   * Team Endpoints
   */
  async createTeam(data: { name: string; description: string }) {
    const team = await this.createTeamUC.execute(data);
    return this.toTeamDTO(team);
  }

  async getTeam(id: string) {
    const team = await this.getOneTeamUC.execute(id);
    return this.toTeamDTO(team);
  }

  async updateTeam(id: string, data: { name?: string; description?: string }) {
    const team = await this.updateTeamUC.execute(id, data);
    return this.toTeamDTO(team);
  }

  async deleteTeam(id: string) {
    await this.deleteTeamUC.execute(id);
    return true;
  }

  async listTeams(pageNumber: number, pageSize: number) {
    const { list, count } = await this.listTeamsUC.execute(pageNumber, pageSize);
    return { list: list.map((t) => this.toTeamDTO(t)), count };
  }

  /**
   * Team Member Endpoints
   */
  async addMember(data: { teamId: string; userId: string; role: string }) {
    const member = await this.addMemberUC.execute(data);
    return this.toMemberDTO(member);
  }

  async removeMember(id: string) {
    await this.removeMemberUC.execute(id);
    return true;
  }

  async listMembers(pageNumber: number, pageSize: number, filters: TeamMemberFilters) {
    const { list, count } = await this.listMembersUC.execute(pageNumber, pageSize, filters);
    return { list: list.map((m) => this.toMemberDTO(m)), count };
  }
}