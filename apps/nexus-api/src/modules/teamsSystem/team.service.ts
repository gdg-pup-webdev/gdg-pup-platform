import { models } from "@packages/nexus-api-contracts";
import {
  TeamRepository,
  teamRepositoryInstance,
} from "./team.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";

type insertDTO = models.teamSystem.team.insert;
type updateDTO = models.teamSystem.team.update;
type memberInserDTO = models.teamSystem.member.insert;
type memberUpdateDTO = models.teamSystem.member.update;

export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository = teamRepositoryInstance,
  ) {}

  createTeam = async (dto: insertDTO, userId: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.teamRepository.createTeam({
          ...dto, 
        }),
      "creating team",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  listTeams = async () => {
    const { data, error } = await tryCatch(
      async () => await this.teamRepository.listTeams(),
      "In service, listing teams",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  getOneTeam = async (teamId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.teamRepository.getOneTeam(teamId),
      "getting team",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  updateTeam = async (teamId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.teamRepository.updateTeam(teamId, dto),
      "updateing team",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteTeam = async (teamId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.teamRepository.deleteTeam(teamId),
      "deleting team",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
 
}

export const teamServiceInstance = new TeamService();
