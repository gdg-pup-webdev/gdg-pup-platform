import { TeamMemberFilters } from "./domain/ITeamMemberRepository";
import { Team } from "./domain/Team";
import { TeamMember } from "./domain/TeamMember";
import { AddTeamMember } from "./useCases/AddTeamMember";
import { CheckTeamExistsByName } from "./useCases/CheckTeamExistsByName";
import { CreateTeam } from "./useCases/CreateTeam";
import { DeleteTeam } from "./useCases/DeleteTeam";
import { GetOneTeam } from "./useCases/GetOneTeam";
import { GetOneTeamMember } from "./useCases/GetOneTeamMember";
import { ListTeamMembers } from "./useCases/ListTeamMembers";
import { ListTeams } from "./useCases/ListTeams";
import { RemoveTeamMember } from "./useCases/RemoveTeamMember";
import { UpdateTeam } from "./useCases/UpdateTeam";
import { UpdateTeamMember } from "./useCases/UpdateTeamMember";

export interface TeamResponseDTO {
  id: string;
  name: string;
  description: string;
  responsibilities: string | null;
  parentTeamId: string | null;
}

export interface TeamMemberResponseDTO {
  id: string;
  teamId: string;
  userId: string;
  name: string | null;
  position: string;
  image: string | null;
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
    private readonly checkTeamExistsByNameUC: CheckTeamExistsByName,
    // Team Member Use Cases
    private readonly addMemberUC: AddTeamMember,
    private readonly removeMemberUC: RemoveTeamMember,
    private readonly updateMemberUC: UpdateTeamMember,
    private readonly listMembersUC: ListTeamMembers,
    private readonly getOneMemberUC: GetOneTeamMember,
  ) {}

  /** * DTO Mappers
   */
  private toTeamDTO(team: Team): TeamResponseDTO {
    const p = team.props;
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      responsibilities: p.responsibilities,
      parentTeamId: p.parentTeamId,
    };
  }

  private toMemberDTO(member: TeamMember): TeamMemberResponseDTO {
    const p = member.props;
    return {
      id: p.id,
      teamId: p.teamId,
      userId: p.userId,
      name: p.name,
      position: p.role,
      image: p.image,
      joinedAt: p.joinedAt.toISOString(),
    };
  }

  /**
   * Team Endpoints
   */
  async createTeam(data: {
    name: string;
    description: string;
    responsibilities?: string | null;
    parentTeamId?: string | null;
  }) {
    const team = await this.createTeamUC.execute({
      ...data,
      responsibilities: data.responsibilities ?? null,
      parentTeamId: data.parentTeamId ?? null,
    });
    return this.toTeamDTO(team);
  }

  async getTeam(id: string) {
    const team = await this.getOneTeamUC.execute(id);
    return this.toTeamDTO(team);
  }

  async updateTeam(
    id: string,
    data: {
      name?: string;
      description?: string;
      responsibilities?: string | null;
      parentTeamId?: string | null;
    },
  ) {
    const team = await this.updateTeamUC.execute(id, data);
    return this.toTeamDTO(team);
  }

  async deleteTeam(id: string) {
    await this.deleteTeamUC.execute(id);
    return true;
  }

  async listTeams(pageNumber: number, pageSize: number) {
    const { list, count } = await this.listTeamsUC.execute(
      pageNumber,
      pageSize,
    );
    return { list: list.map((t) => this.toTeamDTO(t)), count };
  }

  async existsByName(name: string): Promise<boolean> {
    return await this.checkTeamExistsByNameUC.execute(name);
  }

  /**
   * Team Member Endpoints
   */
  async addMember(data: { teamId: string; userId: string; role: string }) {
    const member = await this.addMemberUC.execute(data);
    return this.toMemberDTO(member);
  }

  async updateMember(id: string, data: { role: string }) {
    const member = await this.updateMemberUC.execute(id, data);
    return this.toMemberDTO(member);
  }

  async removeMember(id: string) {
    await this.removeMemberUC.execute(id);
    return true;
  }

  async listMembers(
    pageNumber: number,
    pageSize: number,
    filters: TeamMemberFilters,
  ) {
    const { list, count } = await this.listMembersUC.execute(
      pageNumber,
      pageSize,
      filters,
    );
    return { list: list.map((m) => this.toMemberDTO(m)), count };
  }

  async getMember(id: string) {
    const member = await this.getOneMemberUC.execute(id);
    return this.toMemberDTO(member);
  }
}
