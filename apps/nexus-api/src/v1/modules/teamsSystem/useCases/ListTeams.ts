import { ITeamRepository } from "../domain/ITeamRepository";
import { Team } from "../domain/Team";

export class ListTeams {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(pageNumber: number, pageSize: number): Promise<{ list: Team[]; count: number }> {
    return await this.repo.findAll(Math.max(1, pageNumber), Math.max(1, pageSize));
  }
}