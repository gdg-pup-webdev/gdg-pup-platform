import { ITeamRepository } from "../domain/ITeamRepository";

export class CheckTeamExistsByName {
  constructor(private readonly repo: ITeamRepository) {}

  async execute(name: string): Promise<boolean> {
    const team = await this.repo.findByName(name);
    return !!team;
  }
}
