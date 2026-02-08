import { models } from "@packages/nexus-api-contracts";
import { TeamRepository, teamRepositoryInstance } from "./team.repository.js";

type insertDTO = models.teamSystem.team.insert;
type updateDTO = models.teamSystem.team.update;
type memberInserDTO = models.teamSystem.member.insert;
type memberUpdateDTO = models.teamSystem.member.update;

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
