import { models } from "@packages/nexus-api-contracts";
import { TeamRepository, teamRepositoryInstance } from "./team.repository.js";
import { TablesInsert, TablesUpdate } from "@/v0/types/supabase.types.js";

type insertDTO = TablesInsert<"team">;
type updateDTO = TablesUpdate<"team">;
type memberInserDTO = TablesInsert<"team_member">;
type memberUpdateDTO = TablesUpdate<"team_member">;

export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository = teamRepositoryInstance,
  ) {}

  createTeam = async (dto: insertDTO, userId: string) => {
    return await this.teamRepository.createTeam({
      ...dto,
    });
  };

  listTeams = async () => {
    return await this.teamRepository.listTeams();
  };

  getOneTeam = async (teamId: string) => {
    return await this.teamRepository.getOneTeam(teamId);
  };

  updateTeam = async (teamId: string, dto: updateDTO) => {
    return await this.teamRepository.updateTeam(teamId, dto);
  };

  deleteTeam = async (teamId: string) => {
    return await this.teamRepository.deleteTeam(teamId);
  };
}

export const teamServiceInstance = new TeamService();
