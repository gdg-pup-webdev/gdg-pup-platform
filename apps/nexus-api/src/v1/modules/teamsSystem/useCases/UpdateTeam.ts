import { ITeamRepository } from "../domain/ITeamRepository";
import { Team, TeamUpdateProps } from "../domain/Team";

export class UpdateTeam {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(id: string, updates: TeamUpdateProps): Promise<Team> {
    const team = await this.repo.findById(id);
    if (!team) throw new Error(`Cannot update: Team with ID ${id} not found.`);
    
    team.update(updates);
    return await this.repo.persistUpdates(team);
  }
}