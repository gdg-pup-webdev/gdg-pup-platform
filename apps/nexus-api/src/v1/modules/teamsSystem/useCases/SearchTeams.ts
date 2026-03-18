import { ITeamRepository } from "../domain/ITeamRepository";
import { Team } from "../domain/Team";

export class SearchTeams {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(query: string, limit: number): Promise<Team[]> {
    return await this.repo.search(query, limit);
  }
}