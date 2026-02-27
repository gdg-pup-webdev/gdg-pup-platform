import { ITeamRepository } from "../domain/ITeamRepository";
import { Team } from "../domain/Team";

export class GetOneTeam {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(id: string): Promise<Team> {
    const team = await this.repo.findById(id);
    if (!team) throw new Error(`Team with ID ${id} not found.`);
    return team;
  }
}