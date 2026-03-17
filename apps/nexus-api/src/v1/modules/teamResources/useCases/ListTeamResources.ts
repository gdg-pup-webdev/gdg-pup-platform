import { ITeamResourceRepository, TeamResourceFilters } from "../domain/ITeamResourceRepository";
import { TeamResource } from "../domain/TeamResource";

export class ListTeamResources {
  constructor(private readonly repo: ITeamResourceRepository) {}

  async execute(pageNumber: number, pageSize: number, filters?: TeamResourceFilters): Promise<{ list: TeamResource[]; count: number }> {
    return await this.repo.findAll(pageNumber, pageSize, filters);
  }
}
