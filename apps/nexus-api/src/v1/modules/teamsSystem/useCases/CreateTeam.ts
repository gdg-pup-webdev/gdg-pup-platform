import { ITeamRepository } from "../domain/ITeamRepository";
import { Team, TeamInsertProps } from "../domain/Team";

export class CreateTeam {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(props: TeamInsertProps): Promise<Team> {
    if (!props.name) throw new Error("Team name is required.");
    const team = Team.create(props);
    return await this.repo.saveNew(team);
  }
}